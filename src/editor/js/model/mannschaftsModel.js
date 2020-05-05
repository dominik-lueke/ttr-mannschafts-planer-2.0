class MannschaftsModel {

  constructor(id=0, spielklasse="", nummer=0, variante=0, liga="", sollstaerke=6, spieltag="Freitag", uhrzeit="19:30", spielwoche="A") {
    this.id = id
    this.spielklasse = spielklasse
    this.nummer = nummer
    this.variante = variante
    this.romanNumber = this._getRomanNumberOfInteger(`${this.nummer}`)
    this.name = this.spielklasse + ( this.romanNumber === "I" ? "" : " " + this.romanNumber)
    this.liga = liga,
    this.sollstaerke = sollstaerke,
    this.spieltag = spieltag,
    this.uhrzeit = uhrzeit,
    this.spielwoche = spielwoche,
    this.kommentar = "",
    this.invalid = true,
    this.invalidKommentar = ""
    this.bilanzen = {}
    /*
    {
      Vorrunde-20xx/xy": {
        saison: 20xx/xy,
        halbserie: Vorrunde,
        url: 'https://www.mytischtennis.de/clicktt/WTTV/19-20/ligen/Verbandsliga-1/gruppe/356924/mannschaft/2227601/TuRa-Elsen/infos/'
        bilanzen: [
          {
            einsatz_mannschaft: "Herren",
            name: "Nachname, Vorname"
            rang: "1.1",
            einsaetze: 1,
            1: "1:1",
            2: "2:2",
            3: "",
            4: "",
            5: "",
            6: "",
            gesamt: "3:3",
          },
          {

          }
        ]
      }
    }
    */
  }

  setNummer(nummer) {
    this.nummer = nummer
    const romanNumber = this._getRomanNumberOfInteger(`${this.nummer}`)
    this.name = this.spielklasse + ( romanNumber === "I" ? "" : " " + romanNumber)
  }
  
  /* PRIVATE */

  _getRomanNumberOfInteger(i){
    i = i.replace('15', 'XV');
    i = i.replace('14', 'XIV');
    i = i.replace('13', 'XIII');
    i = i.replace('12', 'XII');
    i = i.replace('11', 'XI');
    i = i.replace('10', 'X');
    i = i.replace('9', 'IX');
    i = i.replace('8', 'VIII');
    i = i.replace('7', 'VII');
    i = i.replace('6', 'VI');
    i = i.replace('5', 'V');
    i = i.replace('4', 'IV');
    i = i.replace('3', 'III');
    i = i.replace('2', 'II');
    i = i.replace('1', 'I');
    return i;
  }

}