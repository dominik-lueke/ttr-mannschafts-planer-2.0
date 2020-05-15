# Tischtennis Mannschafts Planer 2.0

Autor: Dominik Lüke  

---

Der **Tischtennis Mannschafts Planer** ist ein freies und quelloffenes Tool, um Aufstellungen für Tischtennis Mannschaften zu erstellen.

Dieses Tool bietet eine Unterstützung zur Erstellung von WTTV-Wettspielordnungs-konformen Aufstellungen in Bezug auf Spielstärke-Reihenfolge nach QTTR-Werten und Mannschafts-Sollstärken [Stand 01/2020](assets/WO2020-01-01.pdf), Abschnitt H).

Es garantiert allerdings nicht, dass die mit diesem Tool erstellten Aufstellungen vollständig WO-konform sind. Bitte überprüfe die erstellten Aufstellung stets noch einmal auf Richtigkeit. Einige Sonderstatus wie z.B. Jugend-Ersatzspieler oder gleichgestellte Ausländer werden nicht berücksichtigt.

Die Aufstellungen vergangener Halbserien, TTR-Werte und Bilanzen können manuell von den [myTischtennis.de](https://mytischtennis.de) Seiten heruntergeladen werden. Für die eingebetteten Inhalte von myTischtennis.de wird keine Haftung übernommen. Für einige Funktionen ist ein Account bei myTischtennis.de notwendig.

---

Built with
[Electron](https://www.electronjs.org),
[Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction/),
[Font Awesome](https://fontawesome.com/v4.7.0/icons/),
[jQuery](https://jquery.com/),
[jQueryUI,](https://jqueryui.com/) and
[popper.js](https://popper.js.org/)

## Installationsanleitung (Windows 10)

1. Lade die aktuelleste Version des `Tischtennis Mannschafts Planers` aus dem [Download-Bereich](https://bitbucket.org/dominiklueke/ttr-mannschafts-planer-2.0/downloads) herunter

2. Entpacke die geladene `.zip` Datei in einen leeren Ordner

3. Starte die `TischtennisMannschaftsPlaner.exe` aus dem entpackten Verzeichnis.  
(Ein Warnhinweis des Windows Defenders kann ignoriert werden)

## License

[CC0 1.0 (Public Domain)](LICENSE.md)

## Für Entwickler

### Selber bauen

Klone diese Repository:

```powershell
git clone git@bitbucket.org:dominiklueke/ttr-mannschafts-planer-2.0.git
```

Mit node.js starten:

```powershell
npm install
npm start
```

Mit Entwicklertools starten:

```powershell
npm test
```

### Ein Release-Paket bauen

Setze die korrekten Properties in `build.bat`

z.B.

```language
set name=TischtennisMannschaftsPlaner
set platform=win32
set arch=x64
set version=2.1.0
```

Bauen mit `electron-packager`

```powershell
.\build.bat
```
