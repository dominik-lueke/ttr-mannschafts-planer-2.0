class Model {

  constructor() {
    const stored_planung = JSON.parse(localStorage.getItem('localStoragePlanung'))
    this.planung =  this._generateSamplePlanung() //stored_planung ? this._loadPlanungFromJSON(stored_planung) :

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

  /* MYTT MODAL WEBVIEW */
  ladeAufstellungFromMyTischtennis(html_table, planung) {
    // Update planung
    for (var key in planung) {
      if (planung.hasOwnProperty(key)) {
        // TODO halbserie + saison needs to be updated to next halbserie
        this.planung[key] = planung[key]
      }
    }
    this.planung.onHeaderDataChanged()

    // Lade Aufstellung
    // 1) Wipe current Aufstellung by moving all Spieler to position 0.0 and delete SPV,RES,InvalidLists etc
    this.planung.spieler.clearAllSpielerPositionen()
    // 2) Load spieler from html_table
    var el = $('<div></div>');
    el.html(`<html><head><title>titleTest</title></head><body>${html_table}</body></html>`);
    var anzahl_mannschaften = 0
    var anzahl_spieler = 0
    const trs = el.find("tbody tr")
    for (var j = 0; j < trs.length; j++) {
      var tr = $(trs[j])
      var mannschaft = 0
      var position = 0
      var qttr = 0
      var name = ""
      var res = false
      var sbe = false
      var spv = false
      const tds = tr.find("td")
      for (var i = 0; i < tds.length; i++) {
        var td = $(tds[i])
        switch (i) {
          case 0: //position
            var pos_text = td.text().trim().split(".")
            mannschaft = parseInt( pos_text[0], 10)
            position = parseInt( pos_text[1], 10)
            break;
          case 1: //qttr
            qttr = parseInt( td.text().trim(), 10)
            break;
          case 2: //name
            name = td.find("a").text().trim()
            break;
          case 3: //hidden
            break;
          case 4: //status
            var status_text = td.text().trim().split(",")
            status_text.forEach(status => {
              sbe = sbe || status == "SBE"
              res = res || status == "RES"
              spv = spv || status == "SPV"
            })
            break;
          default:
            break;
        }
      }
      if ( name !== "" ) {
        anzahl_spieler++
        var spieler = this.planung.spieler.getSpielerByName(name)
        var id = 0
        if (spieler !== undefined) {
          id = spieler.id
          this.planung.spieler._insertSpielerInMannschaft(spieler, mannschaft, position)
          this.planung.spieler.editSpielerQttr(id, qttr)
        } else {
          if ( mannschaft > this.planung.mannschaften.liste.length ){
            this.planung.addMannschaft(mannschaft)
          }
          id = this.planung.addSpieler(mannschaft, position, name, qttr)
        }
        this.planung.spieler.editSpielerRes(id, res)
        this.planung.spieler.editSpielerSbe(id, sbe)
        this.planung.spieler.editSpielerSpv(id, spv)
        anzahl_mannschaften = mannschaft
      }
    }
    // 3) Delete all spieler which have position 0.0
    this.planung.spieler.cleanUp()
    for (var i=this.planung.mannschaften.liste.length-1;i>=anzahl_mannschaften;i--){
      const id = (this.planung.mannschaften.liste[i]).id
      this.planung.deleteMannschaft(id, false)
    }
    //
    this.planung._commit()
    // close the sidebar
    this.closeSidebar()
  }

  /**
   * PRIVATE
   */

  _commit() {
    // trigger view update
    this.onSidebarViewChanged()
    // store this object
    localStorage.setItem("localStorageView", JSON.stringify(this.view))
  }

  /**
   * LOAD OR GENERATE PLANUNG
   */

  _loadPlanungFromJSON (stored_planung) {
    const load_planung = new PlanungsModel()
    for (var key in stored_planung) {
      if (stored_planung.hasOwnProperty(key)) {

        /* Load MannschaftsListe */
        if ( key == "mannschaften") {
          const mannschaftsListe = load_planung[key]
          /* Set Spielklasse */
          if ( stored_planung.hasOwnProperty("spielklasse") ) {
            mannschaftsListe.spielklasse = stored_planung.spielklasse
          }
          if ( stored_planung.mannschaften.hasOwnProperty("liste") ) {
            /* Load Mannschaften */
            stored_planung.mannschaften.liste.forEach( (mannschaft) => {
              /* Create Mannschaft */
              const new_mannschaft = new MannschaftsModel()
              /* Set properties */
              for (var mannschafts_key in mannschaft){
                if (mannschaft.hasOwnProperty(mannschafts_key)){
                  new_mannschaft[mannschafts_key] = mannschaft[mannschafts_key]
                }
              }
              /* Push into Mannschafts Array */
              mannschaftsListe.liste.push(new_mannschaft)
            })
          }

        /* Load SpielerListe */
        } else if (key == "spieler") {
          const spielerListe = load_planung[key]
          /* Set Spielklasse */
          if ( stored_planung.hasOwnProperty("spielklasse") ) {
            spielerListe.spielklasse = stored_planung.spielklasse
          }
          /* Load Spieler */
          if ( stored_planung.spieler.hasOwnProperty("liste") ) {
            stored_planung.spieler.liste.forEach( (spieler) => {
              /* Create Spieler */
              const new_spieler = new SpielerModel()
              /* Set properties */
              for (var spieler_key in new_spieler){
                if (spieler.hasOwnProperty(spieler_key)){
                  new_spieler[spieler_key] = spieler[spieler_key]
                }
              }
              /* Push into Spieler Array */
              spielerListe.liste.push(new_spieler)
            })
          }

        /* Set properties */ 
        } else {
          load_planung[key] = stored_planung[key]
        }

      }
    }
    return load_planung
  }

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