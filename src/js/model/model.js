class Model {

  constructor() {
    const stored_planung = JSON.parse(localStorage.getItem('localStoragePlanung'))
    this.planung = stored_planung ? this.loadPlanungFromJSON(stored_planung, new PlanungsModel, false) : this._generateSamplePlanung()

    this.view = JSON.parse(localStorage.getItem('localStorageView')) || {
      sidebar: {
        display: "",
        id: 0
      }
    }

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
   * LOAD PLANUNG
   */

  loadPlanungFromJSON (planung_json, current_planung = new PlanungsModel(), update_aufstellung=false) {
    const load_planung = current_planung
    const current_anzahl_mannschaften = current_planung.mannschaften.liste.length
    if (update_aufstellung){
      load_planung.spieler.clearAllSpielerPositionen()
    }
    for (var key in planung_json) {
      if (planung_json.hasOwnProperty(key)) {

        /* Load MannschaftsListe */
        if ( key == "mannschaften") {
          const mannschaftsListe = load_planung[key]
          /* Set Spielklasse */
          if (planung_json.hasOwnProperty("spielklasse") ) {
            mannschaftsListe.spielklasse = planung_json.spielklasse
          }
          if ( planung_json.mannschaften.hasOwnProperty("liste") ) {
            /* Load Mannschaften */
            planung_json.mannschaften.liste.forEach( (mannschaft) => {
              /* Create Mannschaft */
              var new_mannschaft = null
              if ( ! update_aufstellung) {
                new_mannschaft = new MannschaftsModel()
                mannschaftsListe.liste.push(new_mannschaft)
              } else if ("nummer" in mannschaft) {
                if ( (mannschaft.nummer <= load_planung.mannschaften.liste.length) ) {
                  new_mannschaft = load_planung.mannschaften.getMannschaftByNummer(mannschaft.nummer)
                } else {
                  const new_mannschaft_id = load_planung.addMannschaft(mannschaft.nummer)
                  new_mannschaft = load_planung.mannschaften.getMannschaft(new_mannschaft_id)
                }
              }
              if (new_mannschaft != null){
                /* Set properties */
                for (var mannschafts_key in mannschaft){
                  if (mannschaft.hasOwnProperty(mannschafts_key)){
                    new_mannschaft[mannschafts_key] = mannschaft[mannschafts_key]
                  }
                }
              }
            })
          }

        /* Load SpielerListe */
        } else if (key == "spieler") {
          const spielerListe = load_planung[key]
          /* Set Spielklasse */
          if ( planung_json.hasOwnProperty("spielklasse") ) {
            spielerListe.spielklasse = planung_json.spielklasse
          }
          /* Load Spieler */
          if ( planung_json.spieler.hasOwnProperty("liste") ) {
            planung_json.spieler.liste.forEach( (spieler) => {
              /* Create Spieler */
              var new_spieler = undefined
              if ( ! update_aufstellung ) {
                new_spieler = new SpielerModel()
                spielerListe.liste.push(new_spieler)
              } else if ("mytt_id" in spieler) {
                new_spieler = load_planung.spieler.getSpielerByMyTTId(spieler.mytt_id)
                if ( typeof new_spieler === 'undefined' && "name" in spieler) {
                  new_spieler = load_planung.spieler.getSpielerByName(spieler.name)
                  if ( typeof new_spieler === 'undefined' ) {
                    const new_spieler_id = load_planung.spieler.addSpieler(spieler.mannschaft, spieler.position, spieler.name)
                    new_spieler = load_planung.spieler.getSpieler(new_spieler_id)
                  }
                }
              }
              /* Set properties */
              if ( !( typeof new_spieler === 'undefined') ){
                for (var spieler_key in new_spieler){
                  if (spieler.hasOwnProperty(spieler_key)){
                    new_spieler[spieler_key] = spieler[spieler_key]
                  }
                }
              }
            })
          }

        /* Set other planungs properties */ 
        } else {
          load_planung[key] = planung_json[key]
        }
      }
    }
    if ( update_aufstellung ) {
      load_planung.spieler.cleanUp()
      load_planung.spieler.validate()
      for (var i = current_anzahl_mannschaften; i >= load_planung.mannschaften.liste.length; i--) {
        load_planung.mannschaften.deleteMannschaftByNummer(i)
      }
      load_planung.validateAllMannschaften()
    }
    return load_planung
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
    const sample_planung = new PlanungsModel("TuRa Elsen", "WTTV", 187012, "2019/20", "Rückrunde", "11.12.2019", "Herren")
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