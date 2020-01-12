class MannschaftsListeModel {

  constructor(spielklasse="") {
    this.spielklasse = spielklasse
    this.liste = []
  }

  /**
   * PUBLIC
   */

  addMannschaft(nummer=0, liga="Liga", sollstaerke=6, spieltag="Freitag", uhrzeit="19:30", spielwoche="A") {
    const id = this.liste.length > 0 ? Math.max.apply(null, this.liste.map(mannschaft => mannschaft.id)) + 1 : 1
    this.liste.push(new MannschaftsModel(id, this.spielklasse, nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche))
    return id
  }

  deleteMannschaft(id) {
    this.liste = this.liste.filter(mannschaft => ( mannschaft.id !== id ))
    // set new nummern for all mannschaften
    var i = 1
    this.liste.forEach(mannschaft => { mannschaft.setNummer(i); i++ })
  }

  deleteMannschaftByNummer(nummer) {
    const mannschaft = this.getMannschaftByNummer(nummer)
    if (mannschaft != null){
      this.deleteMannschaft(mannschaft.id)
    }
  }

  /* EDIT */

  editMannschaftLiga(id, liga) {
    const mannschaft = this.liste.find(mannschaft => mannschaft.id == id)
    mannschaft.liga = liga
  }

  editMannschaftSollstaerke(id, sollstaerke) {
    const mannschaft = this.liste.find(mannschaft => mannschaft.id == id)
    mannschaft.sollstaerke = sollstaerke
  }

  editMannschaftSpieltag(id, spieltag) {
    const mannschaft = this.liste.find(mannschaft => mannschaft.id == id)
    mannschaft.spieltag = spieltag
  }

  editMannschaftUhrzeit(id, uhrzeit) {
    const mannschaft = this.liste.find(mannschaft => mannschaft.id == id)
    mannschaft.uhrzeit = uhrzeit
  }

  editMannschaftSpielwoche(id, spielwoche) {
    const mannschaft = this.liste.find(mannschaft => mannschaft.id == id)
    mannschaft.spielwoche = spielwoche
  }

  /* CHECK INVALID */

  checkMannschaftInvalid(nummer, spielerListe) {
    const anzahl_mannschaften = this.liste.length
    const countable_spieler = anzahl_mannschaften == nummer ? spielerListe.length : spielerListe.filter(spieler => ! spieler.reserve).length
    const mannschaft = this.liste.find(mannschaft => mannschaft.nummer == nummer)
    // set the invalid flag of the mannschaft
    mannschaft.invalid = mannschaft.sollstaerke > countable_spieler
  }

  /* GETTER */

  getMannschaft(id) {
    return this.liste.find(mannschaft => mannschaft.id == id)
  }

  getMannschaftByNummer(nummer) {
    return this.liste.find(mannschaft => mannschaft.nummer == nummer)
  }

}