class PlanungsModel {

  constructor(verein="", verband="", vereinsNummer="", saison="", halbserie="", qttrDatum="", spielklasse="") {
    this.verein = verein
    this.verband = verband
    this.vereinsNummer = vereinsNummer
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

  editMannschaftLiga(id, liga) {
    this.mannschaften.editMannschaftLiga(id, liga)
    // commit
    this._commit()
  }

  editMannschaftSollstaerke(id, sollstaerke) {
    // edit the sollstaerke
    this.mannschaften.editMannschaftSollstaerke(id, sollstaerke)
    // get mannschafts-nummer of mannschafts-id
    const mannschafts_nummer = (this.mannschaften.getMannschaft(id)).nummer
    // check if mannschaft is invalid
    this.mannschaften.checkMannschaftInvalid(mannschafts_nummer, this.spieler.getSpielerOfMannschaft(mannschafts_nummer))
    // commit
    this._commit()
  }

  editMannschaftSpieltag(id, spieltag) {
    this.mannschaften.editMannschaftSpieltag(id, spieltag)
    // commit
    this._commit()
  }

  editMannschaftUhrzeit(id, uhrzeit) {
    this.mannschaften.editMannschaftUhrzeit(id, uhrzeit)
    // commit
    this._commit()
  }

  editMannschaftSpielwoche(id, spielwoche) {
    this.mannschaften.editMannschaftSpielwoche(id, spielwoche)
    // commit
    this._commit()
  }

  /**
   * SPIELER
   */

  addSpieler(mannschaft, position, name, qttr){
    // add the spieler
    const new_id = this.spieler.addSpieler(mannschaft, position, name, qttr)
    // check if mannschaft is invalid
    this.mannschaften.checkMannschaftInvalid(mannschaft, this.spieler.getSpielerOfMannschaft(mannschaft))
    // commit
    this._commit()
    // return new id
    return new_id
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

  editSpielerFarbe(id, farbe) {
    this.spieler.editSpielerFarbe(id, farbe)
    // commit
    this._commit()
  }

  editSpielerKommentar(id, kommentar) {
    this.spieler.editSpielerKommentar(id, kommentar)
    // commit
    this._commit()
  }

  deleteSpieler(id) {
    // get spieler mannschaft
    const mannschaft_id = this.spieler.getSpieler(id).mannschaft
    // delete the spieler
    this.spieler.deleteSpieler(id)
    // check if mannschaft is now invalid
    this.mannschaften.checkMannschaftInvalid( 
      mannschaft_id, 
      this.spieler.getSpielerOfMannschaft(mannschaft_id)
    )
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
