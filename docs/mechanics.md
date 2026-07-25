# Mechanika karty

## Atrybuty i umiejętności

| Klucz Roll20 | Polska nazwa | Atrybut |
|---|---|---|
| `dexterity` | Zwinność | Sprawność |
| `force` | Krzepa | Siła |
| `infiltration` | Ukradkowość | Sprawność |
| `manipulation` | Manipulacja | Osobowość |
| `meleecombat` | Walka wręcz | Siła |
| `observation` | Spostrzegawczość | Bystrość |
| `rangedcombat` | Walka dystansowa | Sprawność |
| `survival` | Sztuka przetrwania | Bystrość |
| `command` | Dowodzenie | Osobowość |
| `culture` | Znajomość Horyzontu | Osobowość |
| `datadjinn` | Dżin danych | Bystrość |
| `medicurgy` | Medikurgia | Bystrość |
| `mysticpowers` | Mistyczne moce | Osobowość |
| `pilot` | Pilotaż | Sprawność |
| `science` | Nauka | Bystrość |
| `technology` | Technika | Bystrość |

Zwykły test umiejętności:

`atrybut + umiejętność + aktywny modyfikator sprzętu + modyfikator sytuacyjny`

Przed każdym nowym rzutem Roll20 wyświetla natywne okno „Macro Options”.
Pole „Modyfikator” przyjmuje liczby dodatnie, ujemne oraz zero. Wybrana
wartość zmienia pulę przed rzutem. Modlitwa do Ikon nie pyta o nowy
modyfikator — przerzuca wyłącznie niesukcesy z już zmodyfikowanej puli.

Umiejętności zaawansowane wymagają co najmniej jednego poziomu. Test atrybutu wymaga bazowej wartości większej od zera.

## Sukcesy

- każda kość k6 z wynikiem 6 daje jeden sukces;
- 0 sukcesów oznacza porażkę;
- 1–2 sukcesy oznaczają sukces;
- 3 lub więcej sukcesów oznacza sukces krytyczny;
- przy rzucie bronią sukces krytyczny występuje, gdy liczba sukcesów jest większa od wartości „Kryt.” broni;
- przy rzucie desperacji trzeba uzyskać co najmniej 2 sukcesy.

Jeśli końcowa pula wynosi zero lub mniej, karta rzuca dwiema kośćmi desperacji.

## Specjalne rzuty Konsoli

- **Inicjatywa:** `1k10 + modyfikator sytuacyjny`, z opcją `&{tracker}`. Roll20 dodaje albo aktualizuje reprezentujący postać żeton w Turn Trackerze; najwyższy wynik działa pierwszy.
- **Pancerz:** `suma wartości założonych pancerzy + modyfikator sytuacyjny` kości k6. Każda 6 blokuje 1 punkt obrażeń.
- **Napromieniowanie:** `aktualne Napromieniowanie + modyfikator sytuacyjny` kości k6. Każda 6 powoduje 1 punkt obrażeń.

Ujemny modyfikator nie może obniżyć puli Pancerza ani Napromieniowania poniżej
zera. Te rzuty nie korzystają z reguły desperacji i nie można użyć na nich
Modlitwy do Ikon.

## Wartości pochodne

- maksymalne Punkty Wytrzymałości: `Siła + Sprawność + Premia do PW`;
- maksymalne Punkty Umysłu: `Bystrość + Osobowość + Premia do PU`;
- maksymalne obciążenie: `Siła × 2 + premie`.

Waga założonych przedmiotów:

- zerowy lub drobny: 0;
- lekki: 0,5;
- zwykły: 1;
- ciężki: 2.

Każdy wiersz ekwipunku może modyfikować jedną wartość. Sekcja „Dodatkowe modyfikatory przedmiotów” pozwala dołączyć dowolną liczbę kolejnych aktywnych modyfikatorów do tego samego źródła.

## Broń

Broń wręcz używa `Siła + Walka wręcz + premia broni`. Broń dystansowa używa `Sprawność + Walka dystansowa + premia broni`. Do puli dochodzi aktywny modyfikator sprzętu danej umiejętności.

Ogień automatyczny odejmuje dwie kości. Następnie wykonywana jest co najmniej jedna seria `1k6`, kontynuowana po wynikach 2–6 i kończąca się na pierwszej jedynce. Każda wartość pola „Ignorowane jedynki” dodaje jeszcze jedną taką serię.

## Modlitwa do Ikon

Po początkowym rzucie karta zapamiętuje liczbę sukcesów i kości innych niż 6. Przycisk pod wynikiem na czacie rzuca ponownie wyłącznie kośćmi bez sukcesu i zachowuje wcześniejsze szóstki. Po modlitwie nie można rzutu powtórzyć ponownie.

Dla bohatera modlitwa zwiększa ukryty licznik `darkness_generated`, a dla BN-a licznik `darkness_spent`. Nie są one wyświetlane na karcie i nie zastępują wspólnego zasobu kampanii.

## Migracja starej karty

Przy pierwszym otwarciu bez pola `sheet_version` worker przenosi podstawowe wartości ze starej społecznościowej karty Roll20, w tym:

- imię, Punkty Wytrzymałości i Punkty Umysłu;
- trzy umiejętności, których stare klucze zawierały łączniki;
- koncept grupy;
- urazy, broń, sprzęt, talenty i relacje.

Migracja nie usuwa starych atrybutów. Dzięki temu można wrócić do poprzedniej karty po odtworzeniu kampanii z kopii.
