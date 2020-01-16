class Model {

  constructor() {
    const stored_planung = JSON.parse(localStorage.getItem('localStoragePlanung'))
    this.planung = stored_planung ? (new PlanungsModel()).loadFromJSON(stored_planung, true) : this._generateSamplePlanung() // 

    this.view = JSON.parse(localStorage.getItem('localStorageView')) || {
      sidebar: {
        display: "",
        id: 0
      }
    } // 

    this.onSidebarViewChanged = {}
  }

  /**
   * EVENT HANDLER
   */

  bindSidebarViewChanged(callback) {
    this.onSidebarViewChanged = callback
  }

  /**
   * MODEL STATE CHANGE
   */

  /* MANNSCHAFTEN */

  addMannschaft(nummer) {
    const id = this.planung.addMannschaft(nummer)
    this.displayMannschaftDetails(id)
  }

  deleteMannschaft(id, keep_spieler) {
    // Important! First close the sidebar, as the delete action will try to update it with the spieler we just deleted
    this.closeSidebar()
    this.planung.deleteMannschaft(id, keep_spieler)
  }
  
  /* SPIELER */

  addSpieler(mannschaft, position, name, qttr) {
    const id = this.planung.addSpieler(mannschaft, position, name, qttr)
    this.displaySpielerDetails(id)
  }

  deleteSpieler(id) {
    // Important! First close the sidebar, as the delete action will try to update it with the spieler we just deleted
    this.closeSidebar()
    this.planung.deleteSpieler(id)
  }

  /* SIDEBAR */

  displaySpielerDetails(id) {
    this.view.sidebar.display = "spieler"
    this.view.sidebar.id = id
    this._commit()
  }

  displayMannschaftDetails(id) {
    this.view.sidebar.display = "mannschaft"
    this.view.sidebar.id = id
    this._commit()
  }

  closeSidebar() {
    this.view.sidebar.display = ""
    this.view.sidebar.id = 0
    this._commit()
  }

  /**
   * PRIVATE
   */

  /**
   * commit
   */
  _commit() {
    // trigger view update
    this.onSidebarViewChanged()
    // store this object
    localStorage.setItem("localStorageView", JSON.stringify(this.view))
  }

  /**
   * GENERATE A SAMPLE PLANUNG
   */

  _generateSamplePlanung () {
    const sample_planung = new PlanungsModel("TuRa Elsen", "WTTV", 187012, "2019/20", "Rückrunde", "Herren")
    /* Fill with sample Data */
    const qttr_max = 1910
    for (var i=1; i<=3; i++) {
      sample_planung.addMannschaft(i, "Liga", 6, "Samstag", "18:30", "A")
      for (var j=1; j<=6; j++) {
        var id = ( i - 1 ) * 6 + j
        sample_planung.addSpieler(i, j, `Nachname, Vorname ${id}`, qttr_max - 15 * i * j)
      }
    }
    return sample_planung
  }

}