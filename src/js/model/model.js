class Model {

  constructor() {
    const stored_planung = JSON.parse(localStorage.getItem('localStoragePlanung'))
    this.planung = stored_planung ? this._loadPlanungFromJSON(stored_planung) : this._generateSamplePlanung()
  }

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
    const sample_planung = new PlanungsModel("TuRa Elsen", 187012, "2019/20", "Rückrunde", "11.12.2019", "Herren")
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