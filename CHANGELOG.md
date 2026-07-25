# Changelog

## 1.6.5 — 2026-07-25

- opublikowano cztery ikony atrybutów jako osobne pliki PNG dostępne przez publiczne adresy HTTPS GitHub;
- zastąpiono blokowane przez Roll20 adresy `data:image` odwołaniami do `raw.githubusercontent.com`;
- ujednolicono nazwy plików ikon do bezpiecznych nazw ASCII;
- zachowano działające, zgodne z Roll20 style szablonów rzutów na czacie;
- dodano test integralności publicznych adresów ikon i lokalnych plików PNG.

## 1.6.4 — 2026-07-25

- zastąpiono wcześniejsze małe ikony czterema nowymi plikami PNG 128×128 px z katalogu `media`;
- zaktualizowano wszystkie 20 obrazów osadzonych w HTML: cztery ikony atrybutów i szesnaście miniaturek umiejętności;
- dane obrazów nadal nie występują w CSS, dzięki czemu nie trafiają do sanitizera formatowania rzutów;
- dodano test potwierdzający, że HTML zawiera dokładnie aktualne pliki dostarczone w katalogu `media`.

## 1.6.3 — 2026-07-25

- ustalono, że blok stylów czatu jest identyczny z działającą wersją 1.5.2, a odrzucenie formatowania powodowały później dodane zasoby i właściwości obrazów w tym samym pliku CSS;
- usunięto z CSS wszystkie osadzone obrazy, deklaracje masek oraz ich reguły zastępcze;
- ikony atrybutów i umiejętności są teraz zwykłymi elementami `<img>` osadzonymi w HTML karty, dzięki czemu nie trafiają do starszego sanitizera CSS używanego przez szablony czatu;
- przywrócono zestaw właściwości CSS zgodny z ostatnią działającą wersją 1.5.2;
- dodano testy wykrywające konstrukcje znane z wyłączania formatowania szablonów Roll20.

## 1.6.2 — 2026-07-25

- fizycznie usunięto z arkusza zakomentowane dane SVG, które nadal zwiększały rozmiar CSS i mogły zatrzymywać starszy mechanizm sanitizacji szablonów czatu Roll20;
- kompletny blok `.sheet-rolltemplate-coriolis` przeniesiono na sam początek CSS, przed wszystkimi stylami karty i zasobami;
- osadzone ikony PNG pozostawiono na końcu arkusza, dzięki czemu nie mogą wpływać na interpretowanie reguł czatu;
- rozszerzono test regresji o kontrolę braku SVG, położenia szablonu czatu i położenia danych PNG.

## 1.6.1 — 2026-07-25

- przywrócono pełne ostylowanie szablonu rzutów w czacie Roll20;
- zastąpiono problematyczne maski SVG dostarczonymi ikonami PNG osadzonymi bezpośrednio w CSS;
- reguły i dane ikon przeniesiono za kompletny styl szablonu rzutu, aby ewentualny błąd zasobu nie mógł wyłączyć formatowania czatu;
- dodano test regresji pilnujący kolejności stylów czatu i osadzonych ikon.

## 1.6.0 — 2026-07-25

- Reputacja może przyjmować wartości ujemne;
- usunięto podpisy „Sprzęt 0” z kart atrybutów i powiększono nazwy cech;
- symbole atrybutów zastąpiono czterema grafikami dostarczonymi w folderze `media`;
- grafiki są osadzone w CSS jako maski SVG, dzięki czemu nie wymagają zewnętrznego hostingu i zachowują złotą kolorystykę Algol;
- skróty cech przy umiejętnościach zastąpiono miniaturami nowych ikon;
- uporządkowano umiejętności ogólne i zaawansowane alfabetycznie według polskich nazw;
- przyjęto nazwy „Znajomość Horyzontu”, „Dżin danych” i „Technika”;
- przyciski rzutu nieposiadanych umiejętności zaawansowanych są wyszarzone i zablokowane, a ich pola wartości pozostają edytowalne.

## 1.5.2 — 2026-07-25

- usunięto zależność przeliczania ekwipunku od `Promise.all` i przebudowano je na natywne callbacki Sheet Workera Roll20;
- dodano zgodny wstecznie odczyt identyfikatorów sekcji zarówno z nazwą `armor`, jak i `repeating_armor`;
- checkboxy założenia są rozpoznawane zarówno jako `1`, jak i `on`;
- przycisk Pancerza odczytuje założone pancerze bezpośrednio w chwili kliknięcia, zamiast polegać wyłącznie na zapisanej sumie;
- migrację starej karty również przepisano bez zależności od ogólnych obietnic JavaScript.

## 1.5.1 — 2026-07-25

- poprawiono pobieranie identyfikatorów wierszy sekcji powtarzalnych zgodnie z API Roll20;
- założone pancerze ponownie zwiększają obciążenie postaci;
- Konsola rzutów prawidłowo sumuje wartość wszystkich założonych pancerzy;
- ta sama poprawka obejmuje przeliczanie założonej broni, wyposażenia i dodatkowych modyfikatorów;
- poprawiono także odczyt sekcji powtarzalnych podczas migracji danych ze starej karty.

## 1.5.0 — 2026-07-25

- w Konsoli rzutów dodano osobne przyciski Inicjatywy, Pancerza i Napromieniowania;
- Inicjatywa wykonuje `1k10 + modyfikator`, przekazuje wynik do Roll20 Turn Trackera i przypomina, że zaczyna postać z najwyższym wynikiem;
- pula Pancerza jest sumą wartości wszystkich założonych pancerzy;
- pula Napromieniowania jest równa aktualnej wartości Napromieniowania;
- każdy z trzech nowych rzutów otwiera okno modyfikatora;
- nowe rzuty nie udostępniają Modlitwy do Ikon;
- wyniki Pancerza i Napromieniowania pokazują czytelnie liczbę wyrzuconych szóstek bez klasyfikowania rzutu jako sukcesu lub porażki.

## 1.4.0 — 2026-07-25

- każdy nowy rzut otwiera natywne okno Roll20 „Macro Options” z polem „Modyfikator”;
- modyfikator przyjmuje dowolne liczby dodatnie, ujemne oraz zero;
- wybrana wartość jest doliczana do puli przed ustaleniem rzutu desperacji;
- podsumowanie rzutu pokazuje łączny modyfikator sprzętu i sytuacji;
- Modlitwa do Ikon zachowuje modyfikator rzutu podstawowego i nie pyta o niego ponownie.

## 1.3.3 — 2026-07-25

- pole „Personalny problem” jest teraz wielowierszowym polem z uchwytem zmiany rozmiaru;
- pole można powiększać wyłącznie pionowo, maksymalnie do dolnej krawędzi portretu;
- zwiększono rozmiar i kontrast nazw umiejętności oraz skrótów powiązanych cech;
- delikatnie powiększono nagłówki i wiersze paneli umiejętności.

## 1.3.2 — 2026-07-25

- zastąpiono synchronizowane pola maksimum natywnymi polami automatycznie obliczanymi Roll20;
- zastosowano nowe nazwy `hp_formula` i `mp_formula`, aby stare zapisane zera nie przesłaniały formuł;
- maksymalne PW używają bezpośrednio formuły `@{strength}+@{agility}+@{hp_bonus}`;
- maksymalne PU używają bezpośrednio formuły `@{wits}+@{empathy}+@{mp_bonus}`;
- pola maksimum są wyłączone, nieedytowalne i mają ukryte strzałki;
- techniczne wartości `hp_max` i `mp_max` nadal są aktualizowane przez Sheet Workera.

## 1.3.1 — 2026-07-25

- przeniesiono portret do prawej części górnego nagłówka, zgodnie z docelowym układem;
- maksymalne PW i PU są wyświetlane przez niezależne pola `hp_limit` i `mp_limit`, dzięki czemu Roll20 nie interpretuje ich jako specjalnych pól `_max`;
- arkusz nadal zapisuje również techniczne maksima `hp_max` i `mp_max`;
- przywrócono ukrytą akcję `act_push`, wymaganą do uruchamiania Modlitwy do Ikon z czatu;
- odsyłacz Modlitwy wskazuje teraz jawnie postać wykonującą rzut;
- test Modlitwy potwierdza przerzut wyłącznie niesukcesów i sumowanie szóstek z obu rzutów.

## 1.3.0 — 2026-07-25

- poprawiono kolejność PW i PU na „wartość aktualna / wartość maksymalna”;
- maksymalne PW i PU są teraz synchronizowanymi polami tekstowymi tylko do odczytu, bez strzałek;
- przeniesiono portret na górę karty i zachowano jego ozdobną ramkę;
- dodano „Pochodzenie” do wiersza Archetypu i Ikony oraz długie pole „Personalny problem”;
- usunięto „Typ”, a wybór widoczności rzutów przeniesiono do Konsoli rzutów;
- wartości pochodne ponownie znajdują się pod Konsolą rzutów;
- Birry przeniesiono do zakładki Notatki;
- usunięto wyświetlane przy umiejętnościach wartości modyfikatorów „+0”.

## 1.2.0 — 2026-07-25

- maksymalne PW i PU są prezentowane po lewej stronie jako wartości tylko do odczytu;
- maksymalne PW i PU używają dokładnie odpowiednio formuł `Siła + Sprawność + Premia do PW` oraz `Bystrość + Osobowość + Premia do PU`;
- Napromieniowanie, Doświadczenie i Reputacja mają pojedyncze wartości bez maksimów;
- Birry są ręcznym, sześciocyfrowym polem bez strzałek;
- usunięto z widoku karty modlitwę, modyfikator sytuacyjny, dodatkowe kości modlitwy i liczniki Ciemności;
- usunięte modyfikatory nie wpływają już na pule rzutów;
- konsolę ograniczono do własnego rzutu, a jej pozostałe miejsce przeznaczono na portret postaci;
- przeniesiono premie PW, PU i obciążenia do zwartego panelu pod umiejętnościami.

## 1.1.1 — 2026-07-25

- poprawiono wybór podpisu wyniku na podstawie obliczonej liczby sukcesów;
- wyśrodkowano i powiększono okienko liczby sukcesów, a podpis przeniesiono pod wynik;
- zwykłe testy pokazują „Sukces” przy 1–2 sukcesach i „Krytyczny sukces!” przy co najmniej 3;
- próg krytycznego sukcesu broni jest teraz wyliczany jako wartość „Kryt.” + 1.

## 1.1.0 — 2026-07-25

- usunięto pole tempa ruchu z paska zasobów i poszerzono pole birrów do sześciu cyfr;
- dopasowano kontrolki zwiększania i zmniejszania wartości liczbowych do motywu Algol;
- przebudowano szablon rzutów pod kątem kontrastu i czytelności;
- liczba sukcesów jest teraz głównym wynikiem, a najechanie pokazuje wyniki poszczególnych kości;
- dodano działający przycisk „Modlitwa do Ikon” bezpośrednio w wyniku na czacie.

## 1.0.0 — 2026-07-25

- pierwsza kompletna karta bohatera i BN-a;
- autorski czarno-złoty motyw inspirowany Algolem;
- wszystkie atrybuty, umiejętności, zasoby i sekcje ekwipunku;
- własny parser rzutów i Roll Template;
- modlitwa do Ikon, rzuty desperacji i ogień automatyczny;
- wartości pochodne, modyfikatory sprzętu i obciążenie;
- migracja danych ze starej karty społeczności Roll20;
- angielska baza i polskie tłumaczenie.
