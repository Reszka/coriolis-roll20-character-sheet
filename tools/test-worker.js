const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "coriolis-algol.html"), "utf8");
const workerMatch = /<script type="text\/worker">([\s\S]*?)<\/script>/.exec(html);
assert(workerMatch, "Sheet Worker script was not found.");
assert(
  html.includes("{{#rollTotal() computed::outcome 0}}") &&
    html.includes("{{#rollTotal() computed::outcome 1}}") &&
    html.includes("{{#rollTotal() computed::outcome 2}}"),
  "Roll-template verdicts must use the computed outcome rather than the initial placeholder."
);
assert(
  html.indexOf('name="attr_hp"') < html.indexOf('name="attr_hp_formula"') &&
    html.indexOf('name="attr_mp"') < html.indexOf('name="attr_mp_formula"'),
  "Current endurance and mind values should be displayed before maximum values."
);
assert(
  /<input\b[^>]*type="number"[^>]*name="attr_hp_formula"[^>]*value="@\{strength\}\+@\{agility\}\+@\{hp_bonus\}"[^>]*disabled="true"/.test(html) &&
    /<input\b[^>]*type="number"[^>]*name="attr_mp_formula"[^>]*value="@\{wits\}\+@\{empathy\}\+@\{mp_bonus\}"[^>]*disabled="true"/.test(html),
  "Maximum endurance and mind values must use Roll20 auto-calculation formulas."
);
assert(!html.includes('name="attr_radiation_max"'), "Radiation should not have a maximum input.");
assert(!html.includes('name="attr_experience_max"'), "Experience should not have a maximum input.");
assert(!html.includes('name="attr_reputation_max"'), "Reputation should not have a maximum input.");
assert(
  /<input\b[^>]*name="attr_reputation"[^>]*>/.exec(html)[0].indexOf('min="0"') === -1,
  "Reputation should accept negative values."
);
assert(html.includes('<img class="sheet-character-avatar" name="attr_character_avatar"'), "The sheet should display the Roll20 character avatar.");
assert(
  html.indexOf('class="sheet-header-portrait"') < html.indexOf('class="sheet-resource-strip"'),
  "The portrait should be displayed in the top header."
);
assert(!html.includes('name="attr_actor_type"'), "Actor type should not be visible on the sheet.");
assert(
  html.indexOf('name="attr_roll_visibility"') > html.indexOf('class="sheet-roll-console"'),
  "Roll visibility should be displayed inside the roll console."
);
assert(
  html.indexOf('name="act_roll_initiative"') > html.indexOf('name="attr_roll_visibility"') &&
    html.indexOf('name="act_roll_armor"') > html.indexOf('name="act_roll_initiative"') &&
    html.indexOf('name="act_roll_radiation"') > html.indexOf('name="act_roll_armor"') &&
    html.indexOf('name="attr_custom_roll_name"') > html.indexOf('name="act_roll_radiation"'),
  "Initiative, armor and radiation buttons should appear before the custom roll fields."
);
assert.strictEqual((html.match(/name="attr_origin"/g) || []).length, 1, "Origin should occur once in the header.");
assert.strictEqual((html.match(/name="attr_personal_problem"/g) || []).length, 1, "Personal problem should occur once in the header.");
assert(
  /<textarea\b[^>]*name="attr_personal_problem"[^>]*><\/textarea>/.test(html),
  "Personal problem should use a vertically resizable textarea."
);
const css = fs.readFileSync(path.join(root, "coriolis-algol.css"), "utf8");
assert(
  /\.sheet-personal-problem textarea\s*\{[^}]*max-height:\s*calc\(100% - 14px\)[^}]*resize:\s*vertical/s.test(css),
  "Personal problem should resize vertically only up to the portrait edge."
);
assert(
  /\.sheet-skill-row button\[type="action"\]\s*\{[^}]*font-size:\s*13px/s.test(css),
  "Skill names should use the enlarged readable font."
);
const attributeBlock = /<div class="sheet-attributes">([\s\S]*?)<div class="sheet-section-title">/.exec(html)[1];
assert(!attributeBlock.includes("gear-mod"), "Attribute cards should not display automatic gear modifier labels.");
["strength", "agility", "wits", "empathy"].forEach((attribute) => {
  assert(
    attributeBlock.includes(`class="sheet-attribute-glyph sheet-icon-${attribute}"`),
    `The ${attribute} attribute should use its supplied PNG image.`
  );
});
assert(!/<i>[^<]+<\/i>/.test(html), "Skill rows should use attribute icons instead of text abbreviations.");
const iconUrls = [...html.matchAll(/<img class="sheet-(?:attribute-glyph|skill-attribute-icon) sheet-icon-(?:strength|agility|wits|empathy)" src="(https:\/\/raw\.githubusercontent\.com\/Reszka\/coriolis-roll20-character-sheet\/main\/media\/(?:sila|sprawnosc|bystrosc|osobowosc)\.png)" alt="" aria-hidden="true">/g)].map((match) => match[1]);
assert.strictEqual(iconUrls.length, 20, "All four attributes and sixteen skills should use public GitHub PNG URLs.");
const expectedIconUrls = [
  "https://raw.githubusercontent.com/Reszka/coriolis-roll20-character-sheet/main/media/sila.png",
  "https://raw.githubusercontent.com/Reszka/coriolis-roll20-character-sheet/main/media/sprawnosc.png",
  "https://raw.githubusercontent.com/Reszka/coriolis-roll20-character-sheet/main/media/bystrosc.png",
  "https://raw.githubusercontent.com/Reszka/coriolis-roll20-character-sheet/main/media/osobowosc.png"
].sort();
assert.deepStrictEqual(
  [...new Set(iconUrls)].sort(),
  expectedIconUrls,
  "The HTML should reference exactly the four published PNG icons."
);
for (const fileName of ["sila.png", "sprawnosc.png", "bystrosc.png", "osobowosc.png"]) {
  const iconPath = path.join(root, "media", fileName);
  assert(fs.existsSync(iconPath), `Missing media icon: ${fileName}`);
  assert.strictEqual(
    fs.readFileSync(iconPath).subarray(0, 8).toString("hex"),
    "89504e470d0a1a0a",
    `${fileName} should be a valid PNG file.`
  );
}
assert(!html.includes("data:image"), "HTML must not contain image data URLs blocked by Roll20.");
assert(!css.includes("data:image"), "Image data must stay out of CSS so Roll20's chat sanitizer accepts the stylesheet.");
assert(!/(?:^|[-])mask(?:-|:)/m.test(css), "Legacy mask declarations must not remain in CSS.");
assert(!/@charset|\*\*|overscroll-behavior/.test(css), "CSS must not contain constructs known to disable Roll20 roll-template styling.");
assert(![...css].some((character) => character.charCodeAt(0) > 127), "CSS must remain ASCII-only for Roll20's legacy chat sanitizer.");
assert(
  css.trimStart().startsWith(".sheet-rolltemplate-coriolis"),
  "Roll-template styling must be the first CSS block so Roll20's legacy chat sanitizer always receives it."
);
const generalPanel = /data-i18n="general-skills"[\s\S]*?data-i18n="advanced-skills"/.exec(html)[0];
const advancedPanel = /data-i18n="advanced-skills"[\s\S]*?<div class="sheet-section-title">/.exec(html)[0];
assert.deepStrictEqual(
  [...generalPanel.matchAll(/act_roll_([a-z]+)/g)].map((match) => match[1]),
  ["force", "manipulation", "observation", "survival", "infiltration", "rangedcombat", "meleecombat", "dexterity"],
  "General skills should be displayed in Polish alphabetical order."
);
assert.deepStrictEqual(
  [...advancedPanel.matchAll(/act_roll_([a-z]+)/g)].map((match) => match[1]),
  ["command", "datadjinn", "medicurgy", "mysticpowers", "science", "pilot", "technology", "culture"],
  "Advanced skills should be displayed in Polish alphabetical order."
);
assert(
  /\.sheet-skill-trained-flag\[value="0"\] \+ button\[type="action"\]\s*\{[^}]*pointer-events:\s*none/s.test(css),
  "Untrained advanced skill roll buttons should be visibly disabled."
);
assert(!html.includes("sheet-derived-inline"), "Derived values should not remain beneath the skill panels.");
assert(
  html.indexOf('class="sheet-derived"') > html.indexOf('class="sheet-roll-console"'),
  "Derived values should be displayed beneath the roll console."
);
assert(!html.includes("sheet-auto-mod"), "Automatic +0 modifier labels should not be displayed beside skills.");
assert(!html.includes('name="attr_roll_modifier"'), "The manual roll modifier should not be visible on the sheet.");
assert(!html.includes('name="attr_prayer_bonus"'), "Prayer bonus dice should not be visible on the sheet.");
assert(
  html.includes('class="sheet-chat-action" type="action" name="act_push"') &&
    /button\.sheet-chat-action\[type="action"\]\s*\{[^}]*display:\s*none\s*!important/s.test(
      css
    ),
  "Prayer must retain a hidden action button for chat without displaying it on the sheet."
);
assert(
  html.includes('type="text" name="attr_birr"') && !html.includes('type="number" name="attr_birr"'),
  "Birr should be a manually entered field without number spinners."
);
assert(
  html.indexOf('name="attr_birr"') > html.indexOf('class="sheet-tab-notes"'),
  "Birr should be displayed in the Notes tab."
);

const translations = JSON.parse(fs.readFileSync(path.join(root, "translation.json"), "utf8"));
const polishTranslations = JSON.parse(fs.readFileSync(path.join(root, "translations", "pl.json"), "utf8"));
assert.strictEqual(polishTranslations.culture, "Znajomość Horyzontu");
assert.strictEqual(polishTranslations["data-djinn"], "Dżin danych");
assert.strictEqual(polishTranslations.technology, "Technika");
const handlers = {};
const attrs = {};
const sections = {
  gear: [],
  weapons: [],
  armor: [],
  modifiers: [],
  crits: [],
  weapon: [],
  talents: [],
  relationships: []
};
const rollQueue = [];
const modifierQueue = [];
const rolls = [];
const modifierQueries = [];
const finishes = [];
const queryFinishes = [];
let rowCounter = 0;
let queryCounter = 0;

const on = (eventNames, callback) => {
  eventNames.split(/\s+/).filter(Boolean).forEach((eventName) => {
    if (!handlers[eventName]) handlers[eventName] = [];
    handlers[eventName].push(callback);
  });
};

const getAttrs = (names, callback) => {
  const values = {};
  names.forEach((name) => {
    values[name] = Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : "";
  });
  callback(values);
};

const setAttrs = (updates, options, callback) => {
  if (typeof options === "function") callback = options;
  Object.assign(attrs, updates);
  if (callback) callback();
};

const getSectionIDs = (sectionName, callback) => callback(sections[sectionName] || []);
const generateRowID = () => `row${++rowCounter}`;
const getTranslationByKey = (key) => translations[key] || false;

const startRoll = (roll, callback) => {
  if (roll.startsWith("!{{modifier=[[")) {
    modifierQueries.push(roll);
    const modifier = modifierQueue.length ? modifierQueue.shift() : 0;
    callback({
      rollId: `query-${++queryCounter}`,
      results: {
        modifier: { result: modifier }
      }
    });
    return;
  }
  rolls.push(roll);
  const dice = rollQueue.length ? rollQueue.shift() : [];
  callback({
    rollId: `roll-${rolls.length}`,
    results: {
      dice: { dice }
    }
  });
};

const finishRoll = (rollId, computed) => {
  if (rollId.startsWith("query-")) {
    queryFinishes.push({ rollId, computed: computed || {} });
    return;
  }
  finishes.push({ rollId, computed: computed || {} });
};

const context = vm.createContext({
  console,
  Promise,
  Number,
  Object,
  String,
  Math,
  on,
  getAttrs,
  setAttrs,
  getSectionIDs,
  generateRowID,
  getTranslationByKey,
  startRoll,
  finishRoll
});
vm.runInContext(workerMatch[1], context, { filename: "coriolis-algol.worker.js" });

const tick = () => new Promise((resolve) => setImmediate(resolve));
const fire = async (eventName) => {
  assert(handlers[eventName] && handlers[eventName].length, `Missing handler: ${eventName}`);
  handlers[eventName].forEach((handler) => handler({ sourceAttribute: eventName }));
  await tick();
  await tick();
};

const resetRolls = () => {
  rolls.length = 0;
  modifierQueries.length = 0;
  finishes.length = 0;
  queryFinishes.length = 0;
  rollQueue.length = 0;
  modifierQueue.length = 0;
};

const plain = (value) => JSON.parse(JSON.stringify(value));

(async () => {
  Object.assign(attrs, {
    strength: "3",
    agility: "2",
    wits: "4",
    empathy: "3",
    hp_bonus: "0",
    mp_bonus: "0",
    movement_bonus: "0",
    encumbrance_bonus: "0",
    hp: "0",
    mp: "0",
    sheet_version: "",
    character_name: "Samioh",
    roll_visibility: "public",
    actor_type: "character",
    darkness_generated: "0",
    darkness_spent: "0"
  });

  await fire("sheet:opened");
  assert.strictEqual(attrs.hp_max, 5, "HP max should equal Strength + Agility.");
  assert.strictEqual(attrs.mp_max, 7, "MP max should equal Wits + Empathy.");
  assert.strictEqual(attrs.hp, 5, "A new sheet should initialize current HP.");
  assert.strictEqual(attrs.mp, 7, "A new sheet should initialize current MP.");
  assert.strictEqual(attrs.encumbrance_max, 6, "Encumbrance max should equal Strength × 2.");
  assert.strictEqual(attrs.command_trained, 0, "An untrained advanced skill should disable its roll button.");
  attrs.command = "1";
  await fire("change:command");
  assert.strictEqual(attrs.command_trained, 1, "An advanced skill with one point should enable its roll button.");
  attrs.command = "0";
  await fire("change:command");
  assert.strictEqual(attrs.command_trained, 0, "Removing the last point should disable the advanced skill again.");

  Object.assign(attrs, { hp: "2", mp: "3", hp_bonus: "2", mp_bonus: "1" });
  await fire("change:hp_bonus");
  assert.strictEqual(attrs.hp_max, 7, "HP max should include the explicit endurance bonus.");
  assert.strictEqual(attrs.mp_max, 8, "MP max should include the explicit mind bonus.");
  assert.strictEqual(attrs.hp, "2", "Recalculation must not overwrite current HP.");
  assert.strictEqual(attrs.mp, "3", "Recalculation must not overwrite current MP.");
  Object.assign(attrs, { hp_bonus: "0", mp_bonus: "0" });
  await fire("change:hp_bonus");

  sections.gear = ["gear1"];
  Object.assign(attrs, {
    repeating_gear_gear1_gear_equipped: "1",
    repeating_gear_gear1_gear_quantity: "2",
    repeating_gear_gear1_gear_weight: "0.5",
    repeating_gear_gear1_gear_target: "meleecombat",
    repeating_gear_gear1_gear_bonus: "1"
  });
  await fire("change:repeating_gear");
  assert.strictEqual(attrs.mod_meleecombat, 1, "Equipped gear should modify its target.");
  assert.strictEqual(attrs.encumbrance_value, 1, "Equipped gear weight should include quantity.");

  sections.modifiers = ["modifier1"];
  Object.assign(attrs, {
    repeating_modifiers_modifier1_modifier_enabled: "1",
    repeating_modifiers_modifier1_modifier_target: "encumbrance",
    repeating_modifiers_modifier1_modifier_value: "2"
  });
  await fire("change:repeating_modifiers");
  assert.strictEqual(attrs.encumbrance_max, 8, "Additional item modifiers should affect encumbrance.");

  sections.armor = ["armor1", "armor2"];
  Object.assign(attrs, {
    repeating_armor_armor1_armor_equipped: "on",
    repeating_armor_armor1_armor_weight: "1",
    repeating_armor_armor1_armor_rating: "4",
    repeating_armor_armor2_armor_equipped: "0",
    repeating_armor_armor2_armor_weight: "1",
    repeating_armor_armor2_armor_rating: "2"
  });
  await fire("change:repeating_armor");
  assert.strictEqual(attrs.armor_rating_total, 4, "Only equipped armor should contribute to the console armor roll.");
  assert.strictEqual(attrs.encumbrance_value, 2, "Equipped armor should contribute its weight to encumbrance.");

  resetRolls();
  modifierQueue.push(2);
  await fire("clicked:roll_initiative");
  assert.strictEqual(modifierQueries.length, 1, "Initiative should request a modifier.");
  assert(rolls[0].includes("{{initiative=1}}"), "Initiative should use its dedicated result layout.");
  assert(
    rolls[0].includes("{{initiative_roll=[[1d10+(2) &{tracker}]]}}"),
    "Initiative should roll 1d10 plus the selected modifier and send the result to the Turn Tracker."
  );
  assert(!rolls[0].includes("canpush"), "Initiative must not offer Prayer to the Icons.");
  assert.strictEqual(attrs.last_can_push, 0, "Initiative should clear the previous prayer state.");

  resetRolls();
  attrs.armor_rating_total = "0";
  modifierQueue.push(1);
  rollQueue.push([6, 6, 4, 3, 2]);
  await fire("clicked:roll_armor");
  assert(rolls[0].includes("{{pool=5}}"), "The armor roll should use equipped rating plus its modifier.");
  assert.strictEqual(attrs.armor_rating_total, 4, "The armor button should refresh the equipped armor total before rolling.");
  assert(rolls[0].includes("{{utility=1}}"), "Armor should use the neutral utility result.");
  assert(rolls[0].includes("{{resultlabel=Blocked damage}}"), "Armor should label the number of blocked damage points.");
  assert(!rolls[0].includes("canpush"), "Armor must not offer Prayer to the Icons.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 2, outcome: 1, remaining: 3 });
  assert.strictEqual(attrs.last_can_push, 0, "Armor should clear the previous prayer state.");

  resetRolls();
  attrs.radiation = "3";
  modifierQueue.push(-1);
  rollQueue.push([6, 2]);
  await fire("clicked:roll_radiation");
  assert(rolls[0].includes("{{pool=2}}"), "Radiation should roll its current value plus the selected modifier.");
  assert(rolls[0].includes("{{resultlabel=Radiation damage}}"), "Radiation should label the number of damage points.");
  assert(!rolls[0].includes("canpush"), "Radiation must not offer Prayer to the Icons.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 1, outcome: 1, remaining: 1 });
  assert.strictEqual(attrs.last_can_push, 0, "Radiation should clear the previous prayer state.");

  resetRolls();
  Object.assign(attrs, {
    meleecombat: "2",
    roll_modifier: "99"
  });
  rollQueue.push([6, 4, 6, 2, 1, 3]);
  await fire("clicked:roll_meleecombat");
  assert.strictEqual(modifierQueries.length, 1, "Every new roll should request a situational modifier.");
  assert(modifierQueries[0].includes("?{Modifier|0}"), "The modifier query should default to zero.");
  assert.strictEqual(queryFinishes.length, 1, "The hidden modifier query should be completed before the actual roll.");
  assert(rolls[0].includes("{{pool=6}}"), "Skill pool should include attribute, skill and gear, but ignore the removed manual modifier.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 2, outcome: 1, remaining: 4 });
  assert(rolls[0].includes("{{component3value=1}}"), "The roll breakdown should retain active gear modifiers.");
  assert(
    rolls[0].includes("[Pray to the Icons](~@{character_id}|push)"),
    "The initial roll should include a prayer action addressed to the rolling character."
  );
  assert.strictEqual(attrs.last_successes, 2);
  assert.strictEqual(attrs.last_remaining, 4);
  assert.strictEqual(attrs.last_can_push, 1);

  resetRolls();
  attrs.prayer_bonus = "99";
  rollQueue.push([6, 6, 2, 1]);
  await fire("clicked:push");
  assert.strictEqual(modifierQueries.length, 0, "Prayer should reuse the original pool without asking for a new modifier.");
  assert(rolls[0].includes("{{pool=4}}"), `Prayer should reroll only failed dice and ignore removed prayer bonus dice. Roll: ${rolls[0]}`);
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 4, outcome: 2, remaining: 2 });
  assert.strictEqual(attrs.darkness_generated, 1, "A character prayer should generate one Darkness Point.");
  assert.strictEqual(attrs.last_can_push, 0, "A pushed roll cannot be pushed again.");

  resetRolls();
  modifierQueue.push(-2);
  rollQueue.push([6, 4, 2, 1]);
  await fire("clicked:roll_meleecombat");
  assert(rolls[0].includes("{{pool=4}}"), "A negative situational modifier should reduce the dice pool.");
  assert(
    rolls[0].includes("{{component3value=-1}}"),
    "The breakdown should combine the -2 situational modifier with the +1 gear modifier."
  );

  resetRolls();
  Object.assign(attrs, {
    custom_roll_name: "Boosted",
    custom_roll_pool: "2"
  });
  modifierQueue.push(3);
  rollQueue.push([6, 5, 4, 3, 2]);
  await fire("clicked:roll_custom");
  assert(rolls[0].includes("{{pool=5}}"), "A positive situational modifier should increase the dice pool.");
  assert(rolls[0].includes("{{component2value=3}}"), "The positive modifier should be shown in the roll breakdown.");

  resetRolls();
  rollQueue.push([6, 6, 6, 2, 1]);
  await fire("clicked:roll_meleecombat");
  assert.deepStrictEqual(
    plain(finishes[0].computed),
    { dice: 3, outcome: 2, remaining: 2 },
    "Three successes on a normal skill roll should be critical."
  );

  resetRolls();
  rollQueue.push([1, 2, 3, 4, 5]);
  await fire("clicked:roll_meleecombat");
  assert.deepStrictEqual(
    plain(finishes[0].computed),
    { dice: 0, outcome: 0, remaining: 5 },
    "A normal skill roll without any sixes should fail."
  );

  resetRolls();
  attrs.command = "0";
  await fire("clicked:roll_command");
  assert(rolls[0].includes("{{invalid="), "Untrained advanced skills should produce an invalid roll card.");
  assert(!rolls[0].includes("{{dice=[["), "Invalid rolls must not roll dice.");

  resetRolls();
  Object.assign(attrs, {
    agility: "3",
    rangedcombat: "2",
    mod_rangedcombat: "0",
    roll_modifier: "99",
    prayer_bonus: "99",
    repeating_weapons_weapon_name: "Vulcan carbine",
    repeating_weapons_weapon_type: "ranged",
    repeating_weapons_weapon_bonus: "1",
    repeating_weapons_weapon_damage: "3",
    repeating_weapons_weapon_crit: "2",
    repeating_weapons_weapon_range: "long",
    repeating_weapons_weapon_mode: "automatic",
    repeating_weapons_weapon_ignoredones: "0",
    repeating_weapons_weapon_explosive: "0",
    repeating_weapons_weapon_blastpower: "0",
    repeating_weapons_weapon_blastradius: "",
    repeating_weapons_weapon_features: "High Capacity"
  });
  rollQueue.push([6, 4, 1, 2, 6, 1]);
  await fire("clicked:repeating_weapons:weaponroll");
  assert(rolls[0].includes("[[4d6+1d6!>2]]"), "Automatic fire must explode on 2–6 and stop on 1.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 2, outcome: 1, remaining: 4 });
  assert.strictEqual(attrs.last_automatic, 1);
  assert.strictEqual(attrs.last_remaining, 4);

  resetRolls();
  rollQueue.push([6, 3, 2, 1]);
  await fire("clicked:push");
  assert(rolls[0].includes("{{pool=4}}"), "Automatic-fire prayer must not add prayer bonus dice.");
  assert(!rolls[0].includes("!>2"), "Pushing automatic fire rerolls failed dice without starting new bursts.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 3, outcome: 2, remaining: 3 });

  resetRolls();
  Object.assign(attrs, {
    repeating_weapons_weapon_crit: "3",
    repeating_weapons_weapon_mode: "normal"
  });
  rollQueue.push([6, 6, 6, 2, 1, 3]);
  await fire("clicked:repeating_weapons:weaponroll");
  assert.deepStrictEqual(
    plain(finishes[0].computed),
    { dice: 3, outcome: 1, remaining: 3 },
    "A weapon roll must remain a normal success when successes do not exceed Crit."
  );

  resetRolls();
  rollQueue.push([6, 6, 6, 6, 1, 2]);
  await fire("clicked:repeating_weapons:weaponroll");
  assert.deepStrictEqual(
    plain(finishes[0].computed),
    { dice: 4, outcome: 2, remaining: 2 },
    "A weapon roll must become critical when successes exceed Crit."
  );

  resetRolls();
  Object.assign(attrs, {
    custom_roll_name: "Desperate",
    custom_roll_pool: "0",
    roll_modifier: "99",
    prayer_bonus: "99"
  });
  rollQueue.push([6, 1]);
  await fire("clicked:roll_custom");
  assert(rolls[0].includes("{{desperation=1}}"), "A zero pool should become a desperation roll.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 1, outcome: 0, remaining: 1 });

  resetRolls();
  rollQueue.push([6]);
  await fire("clicked:push");
  assert(rolls[0].includes("{{desperation=1}}"), "A pushed desperation roll must keep its two-success threshold.");
  assert.deepStrictEqual(plain(finishes[0].computed), { dice: 2, outcome: 1, remaining: 0 });

  Object.assign(attrs, {
    sheet_version: "",
    version: "2.5",
    name: "Legacy Hero",
    hitpoints: "4",
    mindpoints: "5",
    "melee-combat": "3",
    "ranged-combat": "2",
    "mystic-powers": "1",
    groupconcept: "Explorers",
    repeating_weapon_oldweapon_weapon: "Legacy carbine",
    repeating_weapon_oldweapon_weapon_bonus: "2",
    repeating_weapon_oldweapon_weapon_damage: "3"
  });
  sections.weapon = ["oldweapon"];
  await fire("sheet:opened");
  assert.strictEqual(attrs.character_name, "Legacy Hero", "Legacy name should migrate.");
  assert.strictEqual(attrs.hp, "4", "Legacy HP should migrate without being reset.");
  assert.strictEqual(attrs.meleecombat, "3", "Legacy hyphenated skill should migrate.");
  const migratedWeaponKey = Object.keys(attrs).find((key) =>
    /^repeating_weapons_row\d+_weapon_name$/.test(key) && attrs[key] === "Legacy carbine"
  );
  assert(migratedWeaponKey, "Legacy repeating weapons should migrate to the new section.");

  console.log("Sheet Worker tests passed.");
  console.log("Covered: derived values, gear, skills, advanced skill validation, prayer, initiative, armor, radiation, automatic fire, desperation and legacy migration.");
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
