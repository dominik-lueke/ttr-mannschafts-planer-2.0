class MannschaftsModel {

  constructor(id, spielklasse, nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche) {
    this.id = id
    this.spielklasse = spielklasse
    this.nummer = nummer,
    this.liga = liga,
    this.sollstaerke = sollstaerke,
    this.spieltag = spieltag,
    this.uhrzeit = uhrzeit,
    this.spielwoche = spielwoche,
    this.kommentar = "",
    this.invalid = false,
    this.invalidKommentar = ""
  }

}