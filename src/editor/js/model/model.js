class Model {

  constructor() {
    // FILE
    this.file = ""
    this.filename = ""
    this.saved = (localStorage.getItem('localStorageFileSaved') === "true")
    this.onFileSavedChanged = () => {}
    const stored_filepath = localStorage.getItem('localStorageFilepath')
    if (stored_filepath) { this.setFile(stored_filepath) }

    // store the view
    this.setView()

    // bind handlers
    this.onSidebarViewChanged = () => {}
    this.onFooterDataChanged = () => {}

    // undo-redo history
    this.history = {
      undo: [], // the tip of undo is always the current planung
      redo: []
    }

    // tags
    this.tags = {}

    // load planung or create new
    const stored_planung_json_str = localStorage.getItem('localStoragePlanung')
    const stored_planung_json = stored_planung_json_str ? JSON.parse(stored_planung_json_str) : undefined
    this.planung = this.createNewPlanung(stored_planung_json)

    // tags
    const stored_tags_json_str = localStorage.getItem('localStoragePlanungTags')
    this.tags = stored_tags_json_str ? JSON.parse(stored_tags_json_str) : { } // a map of tagged planungen as json
    
  }

  /**
   * PLANUNG
   */

  createNewPlanung(planung_json=undefined){
    // History
    this.history = {
      undo: [], // the tip of undo is always the current planung
      redo: []
    }
    ipcRenderer.invoke('setUndoEnabled', this.history.undo.length > 1)
    ipcRenderer.invoke('setRedoEnabled', this.history.redo.length > 0)
    // Tags
    this.tags = {}
    // View
    this.closeSidebar()
    // Planung
    this.planung = new PlanungsModel()
    this.planung.bindPlanungStored(this.handlePlanungStored)
    if ( planung_json ) {
      this.planung.loadFromJSON(planung_json, true, true)
    }
    // return this
    return this.planung
  }

  updatePlanung(planung_json, update_aufstellung){
    this.planung.loadFromJSON(planung_json, update_aufstellung)
  }

  updateAufstellungFromMyTT(planung_json){
    // load the aufstellung
    this.planung.loadFromJSON(planung_json, true)
    // directly remove the undo state we have created as the next call will create a new one anyway
    this.history.undo.pop()

    // Assume if we load the Aufstellung of a Serie, we want to start planning the next 
    // Load RR-2019/20 -> Plan VR-2020/21
    this.planung.increaseSerie()
    // directly remove the undo state we have created as the next call will create new one anyway
    this.history.undo.pop()

    // add tag to this aufstellung
    this.addTagToPlanung(`Aufstellung ${planung_json.spieler_spielklasse} ${planung_json.halbserie} ${planung_json.saison} von click-TT geladen`)
  }

  updateTTRWerteFromMyTT(planung_json){
    this.planung.loadFromJSON(planung_json)
    // directly remove the undo state we have created as the next calls will create new ones anyway
    this.history.undo.pop()
    // add tag to this aufstellung
    this.addTagToPlanung(`TTR-Werte Stichtag ${planung_json.ttrwerte.datestring} von myTischtennis geladen`)
  }

  updateBilanzenFromMyTT(planung_json){
    this.planung.loadFromJSON(planung_json)
    // directly remove the undo state we have created as the next calls will create new ones anyway
    this.history.undo.pop()
    // add tag to this aufstellung
    this.addTagToPlanung(`Bilanzen ${planung_json.bilanzen.saisons[0]} von click-TT geladen`)
  }

  handlePlanungStored = (planung) => {
    // set saved to false
    this.setSaved(false)
    // update undo and redo
    if (this.history.undo.length > 100){
      this.history.undo.shift()
    }
    // only update undo if there really is a change
    var planungToStore = planung.getPlanungAsJsonString()
    var lastPlanungOnUndoStack = this.history.undo[this.history.undo.length-1]
    if ( planungToStore !== lastPlanungOnUndoStack ) {
      this.history.undo.push(planungToStore)
    }
    ipcRenderer.invoke('setUndoEnabled', this.history.undo.length > 1)
    ipcRenderer.invoke('setRedoEnabled', this.history.redo.length > 0)

  }

  handleFooterDataChanged = () => {
    this.onFooterDataChanged(this)
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
   * 
   * PLANUNG TAGS
   */

  addTagToPlanung(tag){
    this.planung.setTag(tag)
    const tag_hash = tag.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
    const now = new Date(Date.now())
    const date_options = { weekday: 'long', year: 'numeric', month: '2-digit', day: 'numeric', hour: 'numeric', minute: "2-digit" }
    const tag_planung = this.planung.getPlanungAsJsonString()
    var tag_size = Math.round((Buffer.byteLength(tag_planung, 'utf8') / 1024))
    var tag_bytes = "KB"
    if (tag_size > 900) {
      tag_size = Math.round(tag_size / 1024)
      tag_bytes = "MB"
    }
    this.tags[tag_hash] = {
      name: tag,
      date: now.toString(),
      date_str: now.toLocaleDateString(undefined, date_options) + " Uhr",
      planung: tag_planung,
      tag_size: `${tag_size} ${tag_bytes}`,
    }
    // notify view
    this.onFooterDataChanged(this)
    // store tags
    localStorage.setItem("localStoragePlanungTags", JSON.stringify(this.tags))
  }

  loadTag(tag_id){
    if (this.tags.hasOwnProperty(tag_id)){
      this.planung.loadFromJSON(JSON.parse(this.tags[tag_id].planung), true, true)
    }
  }

  deleteTag(tag_id){
    if (this.tags.hasOwnProperty(tag_id)){
      if ( this.planung.tag === this.tags[tag_id].name){
        this.planung.removeTag()
      }
      delete this.tags[tag_id]
      // notify view
      this.onFooterDataChanged(this)
      // store tags
      localStorage.setItem("localStoragePlanungTags", JSON.stringify(this.tags))
    }
  }

  /**
   * EVENT HANDLER
   */

  bindFileSavedChanged(callback) {
    this.onFileSavedChanged = callback
  }

  bindFooterDataChanged(callback) {
    this.onFooterDataChanged = callback
    this.planung.bindFooterDataChanged(this.handleFooterDataChanged)
  }

  bindSidebarViewChanged(callback) {
    this.onSidebarViewChanged = callback
  }

  /**
   * MODEL STATE CHANGE
   */

  /* MANNSCHAFTEN */

  addMannschaft(spielklasse, nummer) {
    const id = this.planung.addMannschaft(spielklasse, nummer)
    this.displayMannschaftDetails(id)
  }

  deleteMannschaft(id, keep_spieler) {
    // Important! First close the sidebar, as the delete action will try to update it with the spieler we just deleted
    this.closeSidebar()
    this.planung.deleteMannschaft(id, keep_spieler)
  }
  
  /* SPIELER */

  addSpieler(spielklasse, mannschaft, position, name, qttr) {
    const id = this.planung.addSpieler(spielklasse, mannschaft, position, name, qttr)
    this.displaySpielerDetails(id)
  }

  deleteSpieler(id) {
    // Important! First close the sidebar, as the delete action will try to update it with the spieler we just deleted
    this.closeSidebar()
    this.planung.deleteSpieler(id)
  }

  /* SPIELKLASSEN COLLAPSE */

  expandSpielklasse(spielklasse, expanded) {
    if (!this.view.hasOwnProperty('spielklassenExpanded')) {
      this.view.spielklassenExpanded = {}
    }
    this.view.spielklassenExpanded[spielklasse] = expanded
    this._commit()
  }

  /* VIEW */

  resetView() {
    localStorage.removeItem('localStorageView')
    this.setView()
  }

  setView() {
    const stored_view_json_str = localStorage.getItem('localStorageView')
    this.view = stored_view_json_str ? JSON.parse(stored_view_json_str) : {
      sidebar: {
        display: "",
        id: 0
      },
      spielklassenExpanded: {}
    }
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
   * FILE
   */

  setFile(filepath){
    this.file = filepath
    this.filename = path.parse(filepath).base
    this.onFileSavedChanged()
  }

  setSaved(saved){
    this.saved = saved
    localStorage.setItem('localStorageFileSaved',saved)
    this.onFileSavedChanged()
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

}