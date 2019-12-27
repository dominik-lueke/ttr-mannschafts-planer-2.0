class MannschaftsListeModel {

  constructor(spielklasse) {
    this.spielklasse = spielklasse
    this.liste = []
  }

  addMannschaft(nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche) {
    const id = this.liste.length > 0 ? Math.max.apply(null, this.liste.map(mannschaft => mannschaft.id)) + 1 : 1
    this.liste.push(new MannschaftsModel(id, this.spielklasse, nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche))
  }

  deleteMannschaft(id) {
    // TODO Also move spieler to previous mannschaft
    this.liste = this.liste.filter(mannschaft => ( mannschaft.id !== id ))
  }

}