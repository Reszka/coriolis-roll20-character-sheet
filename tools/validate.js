const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "coriolis-algol.html");
const cssPath = path.join(root, "coriolis-algol.css");
const sheetPath = path.join(root, "sheet.json");
const translationPath = path.join(root, "translation.json");
const polishPath = path.join(root, "translations", "pl.json");

const errors = [];
const warnings = [];
const read = (file) => fs.readFileSync(file, "utf8");
const html = read(htmlPath);
const css = read(cssPath);

const check = (condition, message) => {
  if (!condition) errors.push(message);
};

for (const file of [
  htmlPath,
  cssPath,
  sheetPath,
  translationPath,
  polishPath,
  path.join(root, "README.md"),
  path.join(root, "docs", "mechanics.md")
]) {
  check(fs.existsSync(file), `Missing required file: ${path.relative(root, file)}`);
  if (fs.existsSync(file)) {
    check(!fs.readFileSync(file).includes(13), `File must use LF line endings: ${path.relative(root, file)}`);
  }
}

let sheet;
let translation;
let polish;
try {
  sheet = JSON.parse(read(sheetPath));
  translation = JSON.parse(read(translationPath));
  polish = JSON.parse(read(polishPath));
} catch (error) {
  errors.push(`Invalid JSON: ${error.message}`);
}

if (sheet) {
  ["html", "css", "preview", "authors", "instructions"].forEach((key) => {
    check(Boolean(sheet[key]), `sheet.json is missing "${key}"`);
  });
  ["html", "css", "preview"].forEach((key) => {
    if (sheet[key]) check(fs.existsSync(path.join(root, sheet[key])), `sheet.json references missing ${key}: ${sheet[key]}`);
  });
}

check(!/<(?:head|body|svg|section|header|footer)\b/i.test(html), "HTML contains a Roll20-reserved or unsupported element.");
check(!/\sid\s*=/i.test(html), "HTML must not contain id attributes.");
const allowedMediaUrl = /^https:\/\/raw\.githubusercontent\.com\/Reszka\/coriolis-roll20-character-sheet\/main\/media\/(?:sila|sprawnosc|bystrosc|osobowosc)\.png$/;
const externalHtmlUrls = [...html.matchAll(/https?:\/\/[^"'()<>\s]+/gi)].map((match) => match[0]);
check(
  externalHtmlUrls.length === 20 && externalHtmlUrls.every((url) => allowedMediaUrl.test(url)),
  "Sheet HTML may use only the 20 approved public GitHub PNG icon references."
);
check(!/https?:\/\//i.test(css), "Sheet CSS must not depend on external URLs.");

const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
check(scripts.length === 1, `Expected one Sheet Worker script, found ${scripts.length}.`);
if (scripts.length === 1) {
  check(/type="text\/worker"/i.test(scripts[0][1]), "The only script must use type=\"text/worker\".");
  try {
    // Parse only. Roll20 globals such as on/getAttrs are intentionally not executed.
    new Function(scripts[0][2]);
  } catch (error) {
    errors.push(`Sheet Worker syntax error: ${error.message}`);
  }
}

for (const match of html.matchAll(/<input\b([^>]*)>/gi)) {
  check(/\btype="[^"]+"/i.test(match[1]), `Input without an explicit type: <input${match[1]}>`);
}

for (const match of html.matchAll(/<(input|select|textarea|button)\b([^>]*)>/gi)) {
  const tag = match[1].toLowerCase();
  const attrs = match[2];
  const name = /\bname="([^"]+)"/i.exec(attrs);
  if (!name) {
    if (tag !== "button") warnings.push(`Unnamed ${tag} control: <${tag}${attrs}>`);
    continue;
  }
  const validPrefix = name[1].startsWith("attr_") ||
    (tag === "button" && (name[1].startsWith("act_") || name[1].startsWith("roll_")));
  check(validPrefix, `Invalid Roll20 control name: ${name[1]}`);
  check(name[1] === name[1].toLowerCase(), `Attribute names should be lowercase: ${name[1]}`);
}

for (const match of html.matchAll(/class="repeating_([^"]+)"/gi)) {
  check(!match[1].includes("_"), `Repeating section name contains an underscore: repeating_${match[1]}`);
}

const braces = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
check(braces === 0, `CSS braces are unbalanced by ${braces}.`);

const translationKeys = new Set();
for (const match of html.matchAll(/data-i18n(?:-placeholder|-title)?="([^"]+)"/gi)) {
  translationKeys.add(match[1]);
}
for (const match of html.matchAll(/\bt\("([^"]+)"/g)) {
  if (!match[1].endsWith("-")) translationKeys.add(match[1]);
}

if (translation && polish) {
  for (const key of translationKeys) {
    check(Object.prototype.hasOwnProperty.call(translation, key), `Missing English translation key: ${key}`);
    check(Object.prototype.hasOwnProperty.call(polish, key), `Missing Polish translation key: ${key}`);
  }
  for (const key of Object.keys(translation)) {
    if (!translationKeys.has(key)) warnings.push(`Unused English translation key: ${key}`);
  }
  for (const key of Object.keys(polish)) {
    if (!translationKeys.has(key)) warnings.push(`Unused Polish translation key: ${key}`);
  }
}

const repeatingSections = [...html.matchAll(/class="repeating_([^"]+)"/gi)].map((match) => match[1]);
check(new Set(repeatingSections).size === repeatingSections.length, "Repeating section class names must be unique.");

console.log(`Validated ${path.relative(root, htmlPath)} and related files.`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((warning) => console.log(`WARN: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));

if (errors.length) process.exit(1);
