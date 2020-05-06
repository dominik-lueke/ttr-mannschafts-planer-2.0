class Model {

  constructor() {
    // store the view
    const stored_view_json_str = localStorage.getItem('localStorageView')
    this.view = stored_view_json_str ? JSON.parse(stored_view_json_str) : {
      sidebar: {
        display: "",
        id: 0
      }
    }
    this.onSidebarViewChanged = () => {}

    this.history = {
      undo: [], // the tip of undo is always the current planung
      redo: []
    }

    // load planung or create new
    const stored_planung_json_str = localStorage.getItem('localStoragePlanung')
    const stored_planung_json = stored_planung_json_str ? JSON.parse(stored_planung_json_str) : undefined
    this.planung = this.createNewPlanung(stored_planung_json)
  }

  /**
   * PLANUNG
   */

  createNewPlanung(planung_json=undefined){
    // View
    this.closeSidebar()
    // Planung
    this.planung = new PlanungsModel()
    if ( planung_json ) {
      this.planung.loadFromJSON(planung_json, true, true)
    }
    this.planung.bindPlanungStored(this.handlePlanungStored)
    // History
    this.history = {
      undo: [], // the tip of undo is always the current planung
      redo: []
    }
    ipcRenderer.invoke('setUndoEnabled', this.history.undo.length > 1)
    ipcRenderer.invoke('setRedoEnabled', this.history.redo.length > 0)
    // return this
    return this.planung
  }

  updatePlanung(planung_json, update_aufstellung){
    this.planung.loadFromJSON(planung_json, update_aufstellung)
  }

  handlePlanungStored = (planung) => {
    if (this.history.undo.length > 100){
      this.history.undo.shift()
    }
    this.history.undo.push(planung.getPlanungAsJsonString())
    ipcRenderer.invoke('setUndoEnabled', this.history.undo.length > 1)
    ipcRenderer.invoke('setRedoEnabled', this.history.redo.length > 0)
  }

  /**
   * UNDO + REDO
   */

  undo() {
    if ( this.history.undo.length > 1 ) {
      // move the current state from undo to redo history
      this.history.redo.push(this.history.undo.pop())
      // pop the history
      this.planung.loadFromJSON(JSON.parse(this.history.undo.pop()), true, true)
    }
  }

  redo() {
    if ( this.history.redo.length > 0 ) {
      // pop the redo history and apply it
      this.planung.loadFromJSON(JSON.parse(this.history.redo.pop()), true, true)
    }
  }

  resetUndoRedo() {
    this.history = {
      undo: [this.planung.getPlanungAsJsonString()], // the tip of undo is always the current planung
      redo: []
    }
    ipcRenderer.invoke('setUndoEnabled', this.history.undo.length > 1)
    ipcRenderer.invoke('setRedoEnabled', this.history.redo.length > 0)
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
    this.closeSidebar()
    this.view.sidebar.display = "spieler"
    this.view.sidebar.id = id
    this._commit()
  }

  displayMannschaftDetails(id) {
    this.closeSidebar()
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