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
    // add the spieler
    this.spieler.addSpieler(mannschaft, position, name, qttr)
    // check if mannschaft is invalid
    this.mannschaften.checkMannschaftInvalid(mannschaft, this.spieler.getSpielerOfMannschaft(mannschaft))
    // commit
    this._commit()
  }

  reorderSpieler(id, new_mannschaft, new_position) {
    const old_mannschaft = this.spieler.getSpieler(id).mannschaft
    // reorder the spieler
    this.spieler.reorderSpieler(id, new_mannschaft, new_position)
    // check if mannschaften are invalid
    if (old_mannschaft !== new_mannschaft) {
      this.mannschaften.checkMannschaftInvalid(old_mannschaft, this.spieler.getSpielerOfMannschaft(old_mannschaft))
      this.mannschaften.checkMannschaftInvalid(new_mannschaft, this.spieler.getSpielerOfMannschaft(new_mannschaft))
    }
    // commit
    this._commit()
  }

  editSpielerSpv(id, spv) {
    this.spieler.editSpielerSpv(id, spv)
    // commit
    this._commit()
  }

  editSpielerName(id, name) {
    this.spieler.editSpielerName(id, name)
    // commit
    this._commit()
  }

  editSpielerQttr(id, qttr) {
    this.spieler.editSpielerQttr(id, qttr)
    // commit
    this._commit()
  }

  deleteSpieler(id) {
    // check if mannschaft is now invalid
    this.mannschaften.checkMannschaftInvalid( 
      this.spieler.getSpieler(id).mannschaft, 
      this.spieler.getSpielerOfMannschaft(mannschaft)
    )
    // delete the spieler
    this.spieler.deleteSpieler(id)
    // commit
    this._commit()
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
