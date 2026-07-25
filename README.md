# Coriolis — karta Algol do Roll20

Nieoficjalna, samodzielna karta bohatera i BN-a do **Coriolis: Trzeci Horyzont**. Została napisana pod ograniczenia klasycznych kart Roll20 i wizualnie nawiązuje do czarno-złotego, szklanego motywu Algol znanego z Foundry VTT. Nie korzysta z zewnętrznych fontów ani skryptów; cztery ikony atrybutów są pobierane jako publiczne pliki PNG z tego repozytorium.

## Instalacja w kampanii Roll20

Własna karta wymaga konta Roll20 Pro.

1. Otwórz stronę kampanii, następnie **Settings → Game Settings**.
2. W polu **Character Sheet Template** wybierz **Custom**.
3. Wklej zawartość `coriolis-algol.html` do zakładki **HTML Layout**.
4. Wklej zawartość `coriolis-algol.css` do zakładki **CSS Styling**.
5. Do zakładki **Translation** wklej:
   - `translations/pl.json`, jeśli karta ma być od razu po polsku;
   - `translation.json`, jeśli karta ma być po angielsku.
6. Zapisz ustawienia i odśwież otwartą sesję Roll20.

Podczas tworzenia karty wygodniej jest używać **Custom Sheet Sandbox**: wskaż pliki HTML, CSS oraz wybrany plik tłumaczenia. Panel podglądu Roll20 nie uruchamia Sheet Workerów, dlatego rzuty i obliczenia trzeba sprawdzać na karcie otwartej w kampanii albo w Sandboxie.

Przed zmianą karty w istniejącej kampanii warto utworzyć kopię kampanii. Przy pierwszym otwarciu postaci karta próbuje przenieść podstawowe dane i listy ze starej społecznościowej karty Coriolis z 2017 roku.

## Co działa

- cztery atrybuty oraz wszystkie umiejętności ogólne i zaawansowane;
- automatyczne maksima Punktów Wytrzymałości i Punktów Umysłu oraz osobne wartości aktualne;
- pojedyncze wartości Napromieniowania, Doświadczenia i Reputacji;
- portret pobierany automatycznie z avatara postaci Roll20;
- testy pulą k6, sukcesy na wyniku 6, czytelna liczba sukcesów z podglądem poszczególnych kości, sukces zwykły i krytyczny;
- natywne okno „Macro Options” przed rzutem, przyjmujące dodatni lub ujemny modyfikator sytuacyjny;
- osobne rzuty Inicjatywy, Pancerza i Napromieniowania w Konsoli rzutów;
- rzut desperacji przy puli obniżonej do zera lub mniej;
- jeden ponowny rzut po modlitwie do Ikon uruchamiany z wyniku na czacie;
- broń do walki wręcz i dystansowa, premia, obrażenia, krytyk i zasięg;
- ogień automatyczny oraz możliwość ignorowania kolejnych jedynek;
- materiały wybuchowe, siła i promień wybuchu;
- rzuty pancerza;
- ekwipunek modyfikujący atrybuty, umiejętności i wartości pochodne;
- obciążenie liczone z założonego sprzętu, broni i pancerza;
- powtarzalne listy talentów, urazów, relacji, broni, pancerzy i sprzętu;
- biografia, wygląd, stanowisko w załodze, kajuta i notatki;
- rzuty publiczne albo szeptane do MG;
- angielska baza tłumaczeń i polskie tłumaczenie używające terminologii polskiej edycji.

## Ważne zachowanie rzutów

Każdy nowy rzut pyta o modyfikator sytuacyjny. Wpisz `0`, aby pozostawić pulę
bez zmian, liczbę dodatnią, aby dodać kości, albo liczbę ujemną, aby je odjąć.

Specjalne przyciski w Konsoli rzutów działają następująco:

- **Inicjatywa** rzuca `1k10 + modyfikator` i przekazuje wynik do Roll20 Turn Trackera; zaczyna postać z najwyższym wynikiem;
- **Pancerz** rzuca pulą k6 równą sumie wartości wszystkich założonych pancerzy; każda 6 blokuje 1 punkt obrażeń;
- **Napromieniowanie** rzuca pulą k6 równą aktualnej wartości Napromieniowania; każda 6 powoduje 1 punkt obrażeń.

Te trzy rzuty pytają o modyfikator, ale nie można użyć na nich Modlitwy do Ikon.
Przed rzutem Inicjatywy najlepiej zaznaczyć żeton reprezentujący postać, aby
Roll20 mógł jednoznacznie dodać albo zaktualizować go w Turn Trackerze.

Przycisk **Modlitwa do Ikon**, dostępny bezpośrednio pod wynikiem na czacie, powtarza wszystkie kości ostatniego rzutu, które nie pokazały 6. Sukcesy z pierwszego rzutu zostają zachowane. Można powtórzyć każdy rzut tylko raz.

Przy ogniu automatycznym każda seria rzuca kolejnymi k6 aż do pierwszej jedynki. Pole **Ignorowane jedynki** dodaje dodatkową serię za każdą ignorowaną jedynkę. Sam tryb automatyczny odejmuje dwie kości od podstawowej puli.

## Ograniczenia Roll20

Sheet Worker nie ma dostępu do wspólnego, kampanijnego licznika Punktów Ciemności MG. Karta pokazuje modlitwę na czacie i aktualizuje licznik zapisany na postaci; MG musi odwzorować tę zmianę we własnym liczniku kampanii.

Stan „ostatniego rzutu” jest zapisany na postaci. Jeżeli dwie osoby niemal równocześnie rzucają z tej samej postaci, przycisk modlitwy dotyczy rzutu wykonanego jako ostatni.

Ta wersja obejmuje kartę bohatera i BN-a. Karta statku nie jest jeszcze częścią projektu.

## Pliki

- `coriolis-algol.html` — układ, Roll Template i wszystkie Sheet Workery;
- `coriolis-algol.css` — samodzielny motyw Algol oraz styl wyniku na czacie;
- `translation.json` — angielski plik bazowy;
- `translations/pl.json` — polskie tłumaczenie;
- `sheet.json` — metadane wymagane przez repozytorium społeczności Roll20;
- `docs/mechanics.md` — mapowanie mechaniki i opis obliczeń;
- `preview.png` — podgląd karty.
- `media/` — publiczne ikony PNG udostępniane z repozytorium GitHub i pobierane przez Roll20 przez HTTPS.

## Źródła odniesienia

Projekt powstał na podstawie analizy:

- systemu Foundry VTT [`hodpub/yze-coriolis` w wersji 4.3.0](https://github.com/hodpub/yze-coriolis/releases/tag/v4.3.0);
- modułu wizualnego [`kbender84/coriolis-kbender-ui`](https://github.com/kbender84/coriolis-kbender-ui);
- istniejącej społecznościowej karty Coriolis w repozytorium [`Roll20/roll20-character-sheets`](https://github.com/Roll20/roll20-character-sheets/tree/master/Coriolis);
- dokumentacji tworzenia kart w [Roll20 Help Center](https://help.roll20.net/hc/en-us/categories/360003756473-Sheet-Development).

Kod i styl tej karty są napisane od zera. Nie skopiowano grafik ani CSS modułu Algol.

## Licencja i status

Kod jest udostępniany na licencji MIT. To nieoficjalny projekt fanowski, niepowiązany z Free League, Black Monk Games, Foundry VTT ani Roll20.
