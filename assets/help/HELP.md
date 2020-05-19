# Tischtennis Mannschafts Planer - Hilfe

Autor: Dominik Lüke  
Version: 2.1.0  
Datum: 16.05.2020

---

![Splashscreen][splashscreen]

---

Der **Tischtennis Mannschafts Planer** ist ein freies und quelloffenes Programm, um Aufstellungen für Tischtennis Mannschaften einfach per Drag-And-Drop zu erstellen.

**Für die Verwendung des Programms wird keine Registrierung benötigt und es sammelt keine Nutzerdaten.**

Dieses Programm bietet eine Unterstützung zur Erstellung von WTTV-Wettspielordnungs-konformen Aufstellungen in Bezug auf Spielstärke-Reihenfolge nach QTTR-Werten und Mannschafts-Sollstärken ([WTTV WO, Stand 01/2020](../WO2020-01-01.pdf), Abschnitt H).

Es garantiert allerdings nicht vollständig, dass die mit diesem Programm erstellten Aufstellungen komplett WO-konform sind. Bitte überprüfe die erstellten Aufstellung stets noch einmal auf Richtigkeit. Einige Sonderstatus wie z.B. Jugend-Ersatzspieler oder gleichgestellte Ausländer werden nicht berücksichtigt.

Die Aufstellungen vergangener Halbserien, TTR-Werte und Bilanzen können manuell von den [myTischtennis.de](https://mytischtennis.de) Seiten heruntergeladen werden. 
Für die eingebetteten Inhalte von `myTischtennis` wird keine Haftung übernommen. 
Für einige Funktionen ist ein Account bei `myTischtennis` notwendig.

## Inhalt

1. [Installationsanleitung](#markdown-header-1-installationsanleitung)
2. [Starten des Programms](#markdown-header-2-starten-des-programms)
3. [Eine neue Planung beginnen](#markdown-header-3-eine-neue-planung-beginnen)
4. [Planen der Aufstellungen](#markdown-header-4-planen-der-aufstellungen)
    1. [Laden einer Aufstellung von click-TT](#markdown-header-41-laden-einer-aufstellung-von-click-tt)
    2. [Aktualisieren der TTR-Werte](#markdown-header-42-aktualisieren-der-ttr-werte)
    3. [Die Aufstellungen editiern](#markdown-header-43-die-aufstellungen-editiern)
    4. [Laden von Bilanzen von click-TT](#markdown-header-44-laden-von-bilanzen-von-click-tt)
5. [Speichern, Exportieren, Drucken](#markdown-header-5-speichern-exportieren-drucken)

## 1. Installationsanleitung

>Dieses Programm wurde für Windows 10 entwickelt und getestet

1. Lade die aktuelleste Version des `Tischtennis Mannschafts Planers` aus dem [Download-Bereich](https://bitbucket.org/dominiklueke/ttr-mannschafts-planer-2.0/downloads) herunter

2. Entpacke die geladene `.zip` Datei in einen leeren Ordner

3. Starte die `TischtennisMannschaftsPlaner.exe` aus dem entpackten Verzeichnis.  
(Ein Warnhinweis des Windows Defenders kann ignoriert werden)

## 2. Starten des Programms

Beim Starten des Programms bietet das Programm die Möglichkeit, eine neue Planung zu starten oder ein zuvor gespeicherte Planung aus einer `.ttsp` zu Laden.

> **Hinweis:** Wurde die aktuelle Planung beim Beenden der `Tischtennis Mannschafts Planers` in eine Datei gespeichert, so wird beim nächsten Programmstart diese Datei direkt wieder geladen.

![Starten einer neuen Planung bzw. Öffnen einer bereits Planung aus einer Datei][planung-neu-oeffnen]

*Starten einer neuen Planung bzw. Öffnen einer bereits Planung aus einer Datei*

## 3. Eine neue Planung beginnen

Um eine neue Planung zu beginnen, müssen zunächst die Informationen für die Planung eingegeben werden.

![Ausfüllen des Dialogs zur Erstellung einer neuen Planung][planung-neu-dialog]

*Ausfüllen des Dialogs zur Erstellung einer neuen Planung*

### Verband

Es können auch andere Verbände als der `WTTV` ausgewählt werden, allerdings liegt diesem Programm die `WTTV Wettspielordnung Stand 01/2020` zugrunde. Dies ändert sich nicht, wenn hier ein anderer Verband ausgewählt wird.

### Verein

Der Verein sollte genau so eingegeben werden, wie er auf der `myTischtennis` Info Seite benannt ist. Nur so funktioniert das spätere Laden von Aufstellungen, TTR-Werten und Bilanzen von `myTischtennis`.

Es kann der externe Link zur `Vereinssuche` verwendet werden, um den genauen Namen des Vereins herauszufinden.

### Vereins-Nummer

Die Vereinsnummer kann auf der `myTischtennis` Info Seite des Vereins oder über die `Vereinssuche` herausgefunden werden.

Sie wird für das spätere Laden von Aufstellungen, TTR-Werten und Bilanzen von `myTischtennis` benötigt.

Sind `Verein` und `Vereinsnummer` eingegeben, so erscheint ein Link zur Info-Seite des Vereins. Über diesen kann überprüft werden, ob die Eingaben korrekt sind und der Verein auch später gefunden wird.

### Halbserie

Wähle `Vorrunde` oder `Rückrunde`.

### Saison

Gebe die Saison im Format `20YY/YY` ein.

### Spielklasse

Wähle die Spielklasse für die Planung aus.
Es stehen lediglich die `WTTV` Spielklassen zur Verfügung.

Die Planung ist optimiert für die `Damen` und `Herren` Klasse.

Sonderregelungen für die anderen Spielklassen sind eventuell nicht berücksichtigt.

## 4. Planen der Aufstellungen

Wurde eine neue Planung gestartet, so können nun die Aufstellungen manuell angelegt werden, indem zunächst Mannschaften und dann Spieler hinzugefügt werden.
Dies geht über die entsprechenden Buttons

Zudem kann direkt die Aufstellung aus der der Planung vorangegangen Halbserie von `myTischtennis` geladen werden.

> **Achtung** Wurde bereits eine manuelle Planung begonnen, und nachträglich wird eine Aufstellung von `myTischtennis` geladen, so gehen die Spieler-Informationen der manuellen Planung verloren!

![Die leere Planung][planung-leer]

*Die leere Planung*

![Eine manuell angelegte Planung][planung-manuell]

*Eine manuell angelegte Planung*

> **Hinweis** Ist der TTR-Wert eines Spielers unbekannt, so kann der Wert `0` eingetragen werden.

### 4.1 Laden einer Aufstellung von click-TT

Es kann direkt die Aufstellung aus der der Planung vorangegangen Halbserie von `myTischtennis` geladen werden.

Dazu klickt man in einer leeren Planung auf den entsprechenden Link oder verwendet den `CLICK-TT` Link oben rechts.

![Der Dialog zum Laden einer Aufstellung von myTischtennis][planung-lade-aufstellung]

*Der Dialog zum Laden einer Aufstellung von myTischtennis*

Es öffnet sich ein Dialog mit einem Webbrowser, welcher die Aufstellung der vorangeganen Halbserie der aktuellen Planung von `myTischtennis` anzeigt.
Der `Tischtennis Mannschafts Planer` durchsucht die Seite nach der Aufstellung und zeigt in dem Statusbereich unterhalb des Browsers an, ob eine Aufstellung gefunden wurde.

Ist die gefundenen Aufstellung gültig, so lässt sich diese über den `Lade Aufstellung` Button in die aktuelle Planung importieren.

In dem angezeigte Browserfenster lässt sich wie in einem Webbrowser navigieren.
Auch in die URL-Zeile kann eine URL eingefügt und angesurft werden. 
Der Home-Button führt zu der Aufstellung zurück, auf der die aktuelle Planung aufbaut.

> **Hinweis** Durch das Navigieren kann man z.B. auch eine andere Halbserie zu Planung laden, als die aktuelle. 
Die Planung wird dementsprechend angepasst. 
Das ist nützlich, wenn man bereits eine Halbsereie geplant hat und z.B. Spieler bereits mit Kommentaren oder Markierungen versehen hat. 
Diese gehen nicht verloren, wenn man beginnt die nächste Halbserie zu planen und die bereits vorhandene Planung über diesen Dialog aktualisiert.

![Die von myTischtennis geladene Aufstellung im Editor][planung-aufstellung-geladen]

*Die von myTischtennis geladene Aufstellung im Editor*

### 4.2 Aktualisieren der TTR-Werte

Wurde eine Aufstellung von `myTischtennis` geladen, so können die TTR-Werte dir Spieler aktualisiert werden.

Das geht über den `TTR` Button oben rechts.

> **Hinweis** Zum Laden der TTR-Werte wird ein `myTischtennis`-Account benötigt.

![Der Dialog zum Laden der TTR-Werte von myTischtennis][planung-lade-ttr-werte]

*Der Dialog zum Laden der TTR-Werte von myTischtennis*

Erneut erscheint ein Dialog mit einem Webbrowser.

In diesem wird die TTR-Rangliste des Vereins angezeigt, welche nun geladen werden kann.

> **Hinweis** Zunächst wird  `myTischtennis` dazu auffordern sich einzuloggen. Nachdem dies erfolgt ist, lädt die QTTR-Rangliste des Vereins.

> **Hinweis** Der Tischtennis Mannschafts Planer speichert in keinster Weise Zugangsdaten zu myTischtenis! 
Man kann bei der Login-Maske auf `Angemeldet bleiben` klicken, um sich nicht bei jedem Programmstart neu einloggen zu müssen. 
Das funktioniert genau so wie das Einloggen bei `myTischtennis` in einem normalen Webbrowser.

> **Hinweis** Als Premium Mitglied bei `myTischtennis`, kannst man über den Rangliste Filter die aktuellen TTR-Werte laden.

### 4.3 Die Aufstellungen editiern

Die Aufstellung der letzten Halbserie sowie die aktuellen TTR-Werte wurden geladen und die Planung kann beginnen.

Einige Spieler sind nun eventuell ungültig, da sie aufgrund neuer TTR-Werte die Tolrenzen überschreiten.

![Einige Spieler müssen wegen ihrer TTR-Werte umsortiert werden][planung-reihenfolge]

*Einige Spieler müssen wegen ihrer TTR-Werte umsortiert werden*

#### Umsortieren

Spieler können per Drag-and-Drop umsortiert werden.

Es können auch ganze Mannschaften per Drag-and-Drop umsortiert werden.

#### Hinzufügen und Löschen

Unter der letzten Mannschaft kann eine neue Mannschaft hinzugefügt werden.

In jeder Mannschaft können manuell Spieler hinzugefügt werden.

Klicke auf Mannschaften und Spieler, um deren Details zu editieren.

Dort können diese auch entfernt werden.

> **Hinweis** Bevor eine Mannschaft gelöscht wird, wird gefragt, ob die Spieler dieser Mannschaft ebenfalls gelöscht werden sollen oder ob diese behalten und in die vorige Mannschaft verschoben werden sollen.

#### Sperrvermerke vergeben

Spieler können auch nach dem Regelwerk der Wettspielordnung mit Sperrvermerken versehen werden. 

Dies geht nur bei Spieler, welche sich in einer ungültigen Reihenfolge befinden.

#### Sonderstatus RES und SBE

Nur die Sonderstatus `Reservespieler` (RES) und `Senioren-Berechtigung` (SBE) finden aktuell berücksichtigung. 
Diese werden mit der Aufstellung von `myTischtennis` importiert und können über den Spieler Dialog (klicke auf einen Spieler) gesetzt werden.

#### Kommentare, Farben, etc

Von **Mannschaften** kann

* die Liga,
* die Sollstärke,
* der Spieltag,
* die Spielwoche und
* ein Kommentar

editiert werden.

Von **Spieler** kann

* der TTR-Wert,
* der RES Status,
* der SBE Status,
* die Farbe, und
* ein Kommentar

editiert werden.

### 4.4 Laden von Bilanzen von click-TT

Als Hilfe für die Aufstellung können von `myTischtennis` auch die Bilanzen vergangener Halbserien importiert werden.

Das geht über den Bilanzen (`11:9`) Button oben rechts.

![Der Dialog zum Laden der Bilanzen von myTischtennis][planung-lade-bilanzen]

*Der Dialog zum Laden der Bilanzen von myTischtennis*

Auf diesem Dialog können analog zu der Aufstellung und den TTR-Werten die Bilanzen von Halbserien geladen werden.

Navigiere im Browserfenster, um Bilanzen anderer Halbserien zu laden.

![Es können auch andere Halbserien als die vergagene geladen werden][planung-lade-bilanzen-2]

*Es können auch andere Halbserien als die vergagene geladen werden*

In der Planung können nun durch Klick auf Mannschaften und Spieler diese Bilanzen eingesehen werden.


![Die Spieler Details mit Bilanzen][planung-spieler-details]

*Die Details eines Spielers mit Bilanzen*

![Die Mannschaft Details mit Bilanzens][planung-mannschaft-details]

*Die Details einer Mannschaft*

Die Bilanzen können z.B. dabei helfen, Spieler herauszufinden, welche in der Vergangenheit nicht an allen Spielen einer Mannschaften teilgenommen haben und eventuell häufig für Ersatzgestellungen sorgen können.

## 5. Speichern, Exportieren, Drucken

Über das `Datei` Menü kann die Planung, gespeichert, exportiert und gedruckt werden.

Speichere die Planung als `.ttsp` Datei, um diese später wieder zu öffnen.

Die Planung kann außerdem als `PDF` exportiert werden (Unter Windows muss der Drucker `Microsoft Print to PDF` installiert sein), als `.xslx`-Datei für Excel exportiert werden, oder kann gedruckt werden.





[splashscreen]: images/00-Splashscreen.png
[planung-neu-oeffnen]: images/00-Planung-Neu-Oeffnen.png
[planung-neu-dialog]: images/01-Planung-Neu-Dialog.png
[planung-leer]: images/02-Planung-Leer.png
[planung-manuell]: images/02-1-Planung-Manuell.png
[planung-lade-aufstellung]: images/03-Lade-Aufstellung-MyTT.png
[planung-aufstellung-geladen]: images/04-Planung-Aufstellung-Geladen.png
[planung-lade-ttr-werte]: images/05-Lade-TTR-Werte-MyTT.png
[planung-reihenfolge]: images/06-Planung-Ungueltige-Reihenfolge.png
[planung-lade-bilanzen]: images/07-Lade-Bilanzen-MyTT.png
[planung-lade-bilanzen-2]: images/07-Lade-Bilanzen-Andere-Halbserie-MyTT.png
[planung-spieler-details]: images/08-Planung-Spieler-Details-Mit-Bilanzen.png
[planung-mannschaft-details]: images/09-Planung-Mannschaft-Details-Mit-Bilanzen.png