class MannschaftsModel {

  constructor(id=0, spielklasse="", nummer=0, liga="", sollstaerke=6, spieltag="Freitag", uhrzeit="19:30", spielwoche="A") {
    this.id = id
    this.spielklasse = spielklasse
    this.nummer = nummer
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