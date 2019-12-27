class PlanungsModel {

  constructor(verein, vereinsNummer, saison, halbserie, qttrDatum, spielklasse) {
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
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
  }

  deleteMannschaft(id){
    this.mannschaften.deleteMannschaft(id)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
  }


  /**
   * SPIELER
   */

  addSpieler(mannschaft, position, name, qttr){
    this.spieler.addSpieler(mannschaft, position, name, qttr)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
  }

  reorderSpieler(id, new_mannschaft, new_position) {
    this.spieler.reorderSpieler(id, new_mannschaft, new_position)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
  }

  editSpielerSpv(id, spv) {
    this.spieler.editSpielerSpv(id, spv)
    console.log(this.spieler.liste)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
  }

  deleteSpieler(id) {
    this.spieler.deleteSpieler(id)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
  }

}
