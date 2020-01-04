class PlanungsModel {

  constructor(verein="", vereinsNummer="", saison="", halbserie="", qttrDatum="", spielklasse="") {
    this.verein = verein
    this.vereinsNummer= vereinsNummer
    this.saison = saison
    this.halbserie = halbserie
    this.qttrDatum = qttrDatum
    this.spielklasse = spielklasse

    this.mannschaften = new MannschaftsListeModel(this.spielklasse)
    this.spieler = new SpielerListeModel(this.spielklasse)

    this.onMannschaftenChanged = () => {}
  }

  /**
   * EVENT HANDLER
   */

  bindMannschaftenChanged(callback) {
    this.onMannschaftenChanged = callback
  }


  /**
   * MANNSCHAFTEN
   */

  addMannschaft(nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche){
    this.mannschaften.addMannschaft(nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche)
    // commit
    this._commit()
  }

  deleteMannschaft(id){
    this.mannschaften.deleteMannschaft(id)
    // commit
    this._commit()
  }


  /**
   * SPIELER
   */

  addSpieler(mannschaft, position, name, qttr){
    this.spieler.addSpieler(mannschaft, position, name, qttr)
    // commit
    this._commit()
  }

  reorderSpieler(id, new_mannschaft, new_position) {
    this.spieler.reorderSpieler(id, new_mannschaft, new_position)
    // commit
    this._commit()
  }

  editSpielerSpv(id, spv) {
    this.spieler.editSpielerSpv(id, spv)
    // commit
    this._commit()
  }

  editSpielerQttr(id, qttr) {
    this.spieler.editSpielerQttr(id, qttr)
    // commit
    this._commit()
  }

  deleteSpieler(id) {
    this.spieler.deleteSpieler(id)
  }

  /**
   *  Private
   */

   _commit() {
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
    // store this object
    localStorage.setItem("localStoragePlanung", JSON.stringify(this))
   }

}
