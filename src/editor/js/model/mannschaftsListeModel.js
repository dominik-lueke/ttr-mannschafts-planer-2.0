class MannschaftsListeModel {

  constructor() {
    this.liste = []
  }

  /**
   * PUBLIC
   */

  addMannschaft(spielklasse="", nummer=0, liga="Liga", sollstaerke=6, spieltag="Freitag", uhrzeit="19:30", spielwoche="A") {
    const id = this.liste.length > 0 ? Math.max.apply(null, this.liste.map(mannschaft => mannschaft.id)) + 1 : 1
    this.liste.push(new MannschaftsModel(id, spielklasse, nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche))
    return id
  }

  deleteMannschaft(id) {
    const delete_mannschaft = this.liste.find(mannschaft => ( mannschaft.id == id ))
    this.liste = this.liste.filter(mannschaft => ( mannschaft.id !== id ))
    this._setNumbersForAllMannschaften(delete_mannschaft.spielklasse)
  }

  deleteEmptyMannschaften(spielerListe) {
    for (var i=0; i<this.liste.length; i++){
      const mannschaft = this.liste[i]
      mannschaft._hasSpieler = spielerListe.find(spieler => spieler.spielklasse == mannschaft.spielklasse && spieler.mannschaft == mannschaft.spielklasse)
    }
    this.liste = this.liste.filter(mannschaft => ! mannschaft._hasSpieler)
    this.liste.forEach(mannschaft => { delete mannschaft._hasSpieler })
  }

  reorderMannschaftByNummer(spielklasse, nummer, new_nummer){
    // get current mannschaft
    const mannschaft = this.getMannschaftByNummer(nummer,spielklasse)
    if ( ! mannschaft ){ return }
    // compute old and new index
    const new_index = this.liste.indexOf(
      this.liste
      .filter(mannschaft => mannschaft.spielklasse == spielklasse)
      .find(mannschaft => mannschaft.nummer == new_nummer)
    )
    // insert old mannschaft at new position
    this.liste.splice(new_index, 0, this.liste.splice(new_index, 1)[0])
    // update mannschaften nummern
    this._setNumbersForAllMannschaften(spielklasse)
  }

  _setNumbersForAllMannschaften(spielklasse){
    // set new nummern for all mannschaften of the given spielklasse
    var i = 1
    this.liste
    .filter(mannschaft => mannschaft.spielklasse === spielklasse)
    .forEach(mannschaft => { mannschaft.setNummer(i); i++ })
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

  editMannschaftKommentar(id, kommentar) {
    const mannschaft = this.liste.find(mannschaft => mannschaft.id == id)
    mannschaft.kommentar = kommentar
  }

  /* CHECK INVALID */

  checkMannschaftInvalid(spielklasse, nummer, spielerListe) {
    const anzahl_mannschaften = this.liste.filter(mannschaft => mannschaft.spielklasse === spielklasse).length
    const countable_spieler = anzahl_mannschaften == nummer ? spielerListe.length : spielerListe.filter(spieler => ! spieler.reserve).length
    // set the invalid flag of the mannschaft
    this.liste
    .filter(mannschaft => (mannschaft.spielklasse == spielklasse && mannschaft.nummer == nummer))
    .forEach(mannschaft => { mannschaft.invalid = mannschaft.sollstaerke > countable_spieler })
  }

  /* GETTER */

  getMannschaft(id) {
    return this.liste.find(mannschaft => mannschaft.id == id)
  }

  getMannschaftByNummer(nummer, spielklasse) {
    return this.liste
    .filter(mannschaft => mannschaft.spielklasse == spielklasse)
    .find(mannschaft => mannschaft.nummer == nummer)
  }

  getMannschaftByRomanNumber(romanNumber, spielklasse) {
    return this.liste
    .filter(mannschaft => mannschaft.spielklasse == spielklasse)
    .find(mannschaft => mannschaft.romanNumber == romanNumber)
  }

}