class PlanungsModel {

  constructor(verein="", verband="", vereinsNummer="", saison="", halbserie="", spielklasse="") {
    // HEADER DATA
    this.verein = verein
    this.verband = verband
    this.vereinsNummer = vereinsNummer
    this.saison = saison
    this.halbserie = halbserie
    // the spielklasse of the Planung is (Herren,Damen,Jungen,Mädchen,Senioren,Seniorinnen)
    // whereas the spielklasse of the Mannschaften and Spieler is (Herren,Damen,Jungen 18-13,Mädchen 18-13,Senioren 40-80,Seniorinnen 40-80)
    this.spielklasse = spielklasse.split(" ")[0]
    this.url = {
      verein: GET_URL_SLUG_OF_VEREIN(this.verein),
      saison: this._getPreviousSaison().replace("/","-").substring(2),
      halbserie: this._getOtherHalbserie().replace("Vorrunde","vr").replace("Rückrunde","rr"),
      spielklasse: this._getSpielklassenUrlSlug(this.spielklasse)
    }
    this._initAufstellungsStatus()
    this._initTtrWerteStatus()
    this._initBilanzenStatus()
    // FOOTER
    this.tag = ""
    // METADATA
    this.isEmpty = this._isEmpty()
    this.isNew = true
    this.allow_commit = true
    // MANNSCHAFTEN LISTE
    this.mannschaften = new MannschaftsListeModel()
    // SPIELER LISTE
    this.spieler = new SpielerListeModel(this.spielklasse, this.saison)

    this.onMannschaftenChanged = () => {}
    this.onHeaderDataChanged = () => {}
    this.onFooterDataChanged = () => {}
    this.onPlanungStored = () => {}
    this.onErrorOccured = () => {}
  }

  _initAufstellungsStatus() {
    this.aufstellung = {
      url: this._getAufstellungsUrl(),
      status: "offline"
    }
  }

  _initTtrWerteStatus() {
    this.ttrwerte = {
      url: this._getTtrRanglisteUrl(),
      status: "offline",
      date: new Date(0,0),
      aktuell: "Q-TTR",
      datestring: ""
    }
  }

  _initBilanzenStatus() {
    this.bilanzen = {
      url: this._getBilanzenUrl(),
      status: "offline",
      saisons: []
    }
  }

  /**
   * EVENT HANDLER
   */

  bindMannschaftenChanged(callback) {
    this.onMannschaftenChanged = callback
  }

  bindHeaderDataChanged(callback) {
    this.onHeaderDataChanged = callback
  }

  bindFooterDataChanged(callback) {
    this.onFooterDataChanged = callback
  }

  bindPlanungStored(callback) {
    this.onPlanungStored = callback
  }

  bindErrorOccured(callback) {
    this.onErrorOccured = callback
  }

  /**
   * PLANUNG
   */

  _getOtherHalbserie(){
    return this.halbserie == "Vorrunde" ? "Rückrunde" : "Vorrunde"
  }

  _getPreviousSaison(){
    var prevSaisonRaw = `${parseInt( this.saison.replace("/",""),10) - 101}`
    return this.halbserie == "Vorrunde" ? [prevSaisonRaw.slice(0,4),"/",prevSaisonRaw.slice(4)].join('') : this.saison
  }

  _getNextSaison(){
    var nextSaisonRaw = `${parseInt( this.saison.replace("/",""),10) + 101}`
    return this.halbserie == "Vorrunde" ? [nextSaisonRaw.slice(0,4),"/",nextSaisonRaw.slice(4)].join('') : this.saison
  }

  increaseSerie(){
    this.halbserie = this._getOtherHalbserie()
    this.saison = this._getNextSaison()
    this._updateUrlStrings()
    this._setBilanzenStatus()
    this._commit()
  }

  decreaseSerie(){
    this.halbserie = this._getOtherHalbserie()
    this.saison = this._getPreviousSaison()
    this._commit()
  }

  _setTtrwerteStatus(){
    if (this.ttrwerte.status !== 'offline') {
      const today = new Date(Date.now())
      const this_year = today.getFullYear()
      // get latest qttr-stichtag
      var latest_qttr_stichtag
      [-11,1,4,7,11].forEach(month => {
        var year = this_year
        year -= month < 0 ? 1 : 0
        month = Math.abs(month)
        var qttr_stichtag = new Date(year, month, 11)
        if ( today.getTime() > qttr_stichtag.getTime()) { 
          latest_qttr_stichtag = qttr_stichtag 
        }
      })
      this.ttrwerte.status = this.ttrwerte.date.getTime() >= latest_qttr_stichtag.getTime() ? "ok" : "outdated"
    }
  }

  _setBilanzenStatus(){
    // Check if the latest saison from Bilanzen is at least the previous halbserie of this planung
    if (this.bilanzen.saisons.length > 0) {
      if ( COMPARE_HALBSERIEN(this.bilanzen.saisons[0], this._getOtherHalbserie() + " " + this._getPreviousSaison()) <= 0 ){
        this.bilanzen.status = "ok"
      } else {
        this.bilanzen.status = "outdated"
      }
    } else {
      this.bilanzen.status = "offline"
    }
  }

  /**
   * TAG
   */

  setTag(tag){
    this.tag = tag
    this.onFooterDataChanged()
    this._storePlanung()
  }

  removeTag(){
    this.tag = ""
    this.onFooterDataChanged()
    this._storePlanung()
  }

  /**
   * MANNSCHAFTEN
   */

  addMannschaft(spielklasse, nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche){
    // add the mannschaft
    const new_id = this.mannschaften.addMannschaft(spielklasse, nummer, liga, SOLLSTAERKEN[this.spielklasse], spieltag, uhrzeit, spielwoche)
    // Check for the last two mannschaften if they are invalid now
    const spielklasse_mannschaften = this.mannschaften.liste.filter(mannschaft => mannschaft.spielklasse == spielklasse)
    spielklasse_mannschaften
    .filter(mannschaft => mannschaft.nummer >= spielklasse_mannschaften.length - 1)
    .forEach(mannschaft => {
      this._checkMannschaftInvalid(mannschaft.spielklasse, mannschaft.nummer)
    })
    // commit
    this._commit()
    // return new id
    return new_id
  }

  deleteMannschaft(id, keep_spieler){
    const delete_mannschaft = this.mannschaften.getMannschaft(id)
    const mannschaft_spielklasse = delete_mannschaft.spielklasse
    const mannschaft_nummer = delete_mannschaft.nummer
    // delete the mannschaft from spieler-liste
    this.spieler.deleteMannschaft(mannschaft_spielklasse, mannschaft_nummer, keep_spieler)
    // delete the mannschaft from mannschafts-liste
    this.mannschaften.deleteMannschaft(id)
    // Check for the last mannschaft if it is (in)valid now
    this.mannschaften.liste
    .filter(mannschaft => mannschaft.spielklasse == mannschaft_spielklasse)
    .slice(-1)
    .forEach(mannschaft => {
      this._checkMannschaftInvalid(mannschaft.spielklasse, mannschaft.nummer)
    })
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
    const mannschaft = this.mannschaften.getMannschaft(id)
    // check if mannschaft is invalid
    this._checkMannschaftInvalid(mannschaft.spielklasse, mannschaft.nummer)
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

  editMannschaftKommentar(id, kommentar) {
    this.mannschaften.editMannschaftKommentar(id, kommentar)
    // commit
    this._commit()
  }

  reorderMannschaft(spielklasse, new_spielklasse, mannschaft_nummer, new_mannschaft_nummer) {
    if (spielklasse == new_spielklasse) {
      // reorder mannschaften
      this.mannschaften.reorderMannschaftByNummer(spielklasse, mannschaft_nummer, new_mannschaft_nummer)
      // set new mannschaften for spieler
      const temp_number = -1
      this.spieler.reorderMannschaft(spielklasse, mannschaft_nummer, temp_number)
      if ( mannschaft_nummer < new_mannschaft_nummer ) {
        for (var i=mannschaft_nummer+1; i<=new_mannschaft_nummer; i++) {
          this.spieler.reorderMannschaft(spielklasse,i,i-1)
        }
      } else {
        for (var i=mannschaft_nummer-1; i>=new_mannschaft_nummer; i--) {
          this.spieler.reorderMannschaft(spielklasse,i,i+1)
        }
      }
      this.spieler.reorderMannschaft(spielklasse,temp_number,new_mannschaft_nummer)
      // commit
      this._commit()
    } else {
      // reset the view
      this.onMannschaftenChanged()
      this.onErrorOccured(`Es ist nicht erlaubt, Mannschaften zwischen Spielklassen zu verschieben`)
    }
    
  }

  validateAllMannschaften() {
    this.mannschaften.liste.forEach(mannschaft => {
      this._checkMannschaftInvalid(mannschaft.spielklasse, mannschaft.nummer)
    })
  }

  /**
   * SPIELER
   */

  addSpieler(spielklasse, mannschaft, position, name, qttr){
    // add the spieler
    const new_id = this.spieler.addSpieler(spielklasse, mannschaft, position, name, qttr)
    // check if mannschaft is invalid
    this._checkMannschaftInvalid(spielklasse, mannschaft)
    // commit
    this._commit()
    // return new id
    return new_id
  }

  reorderSpieler(id, new_spielklasse, new_mannschaft, new_position) {
    const spieler = this.spieler.getSpieler(id)
    const old_mannschaft = spieler.mannschaft
    const old_spielklasse = spieler.spielklasse
    try {
      // reorder the spieler
      this.spieler.reorderSpieler(id, new_spielklasse, new_mannschaft, new_position)
      // check if mannschaften are invalid
      if (old_spielklasse !== new_spielklasse || old_mannschaft !== new_mannschaft) {
        this._checkMannschaftInvalid(old_spielklasse, old_mannschaft)
        this._checkMannschaftInvalid(new_spielklasse, new_mannschaft)
      }
      // commit
      this._commit()
    } catch (e) {
      // reset the view
      this.onMannschaftenChanged()
      this.onErrorOccured(`Spieler "${spieler.name}" darf nicht zweimal in der Spielklasse "${new_spielklasse}" gemeldet werden.`)
    }
    
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
    const spieler = this.spieler.getSpieler(id)
    if (spieler.mytt_id !== 0) {
      this.spieler.getSpielerListeByMyTTId(spieler.mytt_id).forEach(s => {
        this.spieler.editSpielerQttr(s.id, qttr)
      })
    } else {
      this.spieler.editSpielerQttr(id, qttr)
    }
    // commit
    this._commit()
  }

  editSpielerJahrgang(id, jahrgang) {
    const spieler = this.spieler.getSpieler(id)
    if (spieler.mytt_id !== 0) {
      this.spieler.getSpielerListeByMyTTId(spieler.mytt_id).forEach(s => {
        this.spieler.editSpielerJahrgang(s.id, jahrgang)
      })
    } else {
      this.spieler.editSpielerJahrgang(id, jahrgang)
    }
    // commit
    this._commit()
  }

  editSpielerRes(id, res) {
    this.spieler.editSpielerRes(id, res)
    // check if the mannschaft is now (in)valid
    const spieler = this.spieler.getSpieler(id)
    this._checkMannschaftInvalid(spieler.spielklasse, spieler.mannschaft)
    // commit
    this._commit()
  }

  editSpielerSbe(id, sbe) {
    this.spieler.editSpielerSbe(id, sbe)
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
    const spieler = this.spieler.getSpieler(id)
    const mannschaft = spieler.mannschaft
    const spielklasse = spieler.spielklasse
    // delete the spieler
    this.spieler.deleteSpieler(id)
    // check if mannschaft is now invalid
    this._checkMannschaftInvalid(spielklasse, mannschaft)
    // commit
    this._commit()
  }

  /**
   * JSON LOAD
   */

  loadFromJSON(planung_json, update_aufstellung=false, purge=false) {
    try {
      this._parsePlanungJson(planung_json, update_aufstellung, purge)
    } catch (e){
      this.onErrorOccured(`Ein interner Fehler ist aufgetreten:<br/>${e}`)
    }
    this.isEmpty = this._isEmpty()
    if ( ! this.isNew ) {
      var save_tag = ""
      if (planung_json.hasOwnProperty('tag')) {
        // Do not use setTag function as we do not want to notify that the planung has changed
        // and then create a new entry in the "undo" list of the model
        save_tag = planung_json.tag
      }
      this._commit(save_tag)
    }
  }

  _parsePlanungJson(planung_json, update_aufstellung=false, purge=false) {
    this._disableCommit() // do no commit while loading the whole json

    if (purge) {
      this.spieler.liste = []
      this.mannschaften.liste = []
      this._initAufstellungsStatus()
      this._initTtrWerteStatus()
      this._initBilanzenStatus()
    }

    // set saison also for spieler
    if (planung_json.hasOwnProperty("saison")) {
      this.spieler.saison = planung_json.saison
    }

    if (update_aufstellung){
      if (planung_json.hasOwnProperty("spieler_spielklasse")) {
        this.spieler.clearAllSpielerPositionen(planung_json.spieler_spielklasse)
      } else if (planung_json.hasOwnProperty("spielklasse")) {
        this.spieler.clearAllSpielerPositionen(planung_json.spielklasse)
      }
    }

    var qttr_values_changed = false

    for (var key in planung_json) {
      if (this.hasOwnProperty(key)) {

        if ( key == "spielklasse") {
          /* Legacy Spielklassen, convert e.g. "Jungen 18" to "Jungen" */
          this.spielklasse = planung_json.spielklasse.split(' ')[0]
  
        } else if ( key == "mannschaften") {
          /* Load MannschaftsListe */
          if ( planung_json.mannschaften.hasOwnProperty("liste") ) {
            /* Load Mannschaften */
            planung_json.mannschaften.liste.forEach( (mannschaft) => {
              /* Create Mannschaft */
              var new_mannschaft = null
              if ( ! update_aufstellung) {
                if ("romanNumber" in mannschaft) {
                  new_mannschaft = this.mannschaften.getMannschaftByRomanNumber(mannschaft.romanNumber, mannschaft.spielklasse)
                } else {
                  new_mannschaft = new MannschaftsModel()
                  this.mannschaften.liste.push(new_mannschaft)
                }
              } else if ("nummer" in mannschaft) {
                if ( (mannschaft.nummer <= this.mannschaften.liste.filter(m => m.spielklasse == mannschaft.spielklasse).length) ) {
                  new_mannschaft = this.mannschaften.getMannschaftByNummer(mannschaft.nummer, mannschaft.spielklasse)
                } else {
                  const new_mannschaft_id = this.addMannschaft(mannschaft.spielklasse, mannschaft.nummer)
                  new_mannschaft = this.mannschaften.getMannschaft(new_mannschaft_id)
                }
              }
              if (new_mannschaft != null){
                /* Set properties */
                for (var mannschafts_key in mannschaft){
                  if (mannschaft.hasOwnProperty(mannschafts_key)){
                    // Special case for bilanzen where we extend the hashmap
                    if (mannschafts_key === 'bilanzen') {
                      for (var saison_key in mannschaft[mannschafts_key] ){
                        new_mannschaft[mannschafts_key][saison_key] = mannschaft[mannschafts_key][saison_key]
                      }
                    } else {
                      new_mannschaft[mannschafts_key] = mannschaft[mannschafts_key]
                    }
                  }
                }
              }
            })
          }

        /* Load SpielerListe */
        } else if (key == "spieler") {
          /* Load SpielerListe */
          if ( planung_json.spieler.hasOwnProperty("liste") ) {
            planung_json.spieler.liste.forEach( (spieler) => {
              /* Create Spieler */
              var new_spieler = undefined
              // try to find spieler by mytt_id
              new_spieler = this.spieler.getSpielerByMyTTId(spieler.mytt_id, spieler.spielklasse)
              if ( typeof new_spieler === 'undefined') {
                // try to find spieler by internal id
                if ( "id" in spieler ) {
                  new_spieler = this.spieler.getSpieler(spieler.id)
                }
                if ( typeof new_spieler === 'undefined' ) {
                  if ( update_aufstellung ) {
                    // spieler not there yet and we want to update the aufstellung, create a new one
                    const new_spieler_id = this.spieler.addSpieler(spieler.spielklasse, spieler.mannschaft, spieler.position, spieler.name)
                    new_spieler = this.spieler.getSpieler(new_spieler_id)
                  }
                }
              }
              /* Set properties */
              if ( !( typeof new_spieler === 'undefined') ){
                for (var spieler_key in new_spieler){
                  if (spieler.hasOwnProperty(spieler_key)){
                    // Special case for bilanzen where we extend the hashmap for all spieler with the same mytt_id
                    if (spieler_key === 'bilanzen') {
                      this.spieler.getSpielerListeByMyTTId(new_spieler.mytt_id).forEach( spieler1 => {
                        for (var saison_key in spieler[spieler_key] ){
                          spieler1[spieler_key][saison_key] = spieler[spieler_key][saison_key]
                        }
                      })
                    // Special case for qttr which is set for all spieler with the same mytt_id
                    } else if (spieler_key === 'qttr') {
                      new_spieler[spieler_key] = spieler[spieler_key]
                      this.spieler.getSpielerListeByMyTTId(new_spieler.mytt_id).forEach( spieler1 => {
                        spieler1[spieler_key] = spieler[spieler_key]
                      })
                      qttr_values_changed = true
                    // Special case for qttrdate which we convert to a Date object for all spieler with the same mytt_id
                    } else if (spieler_key === 'qttrdate') {
                      new_spieler[spieler_key] = new Date(spieler.qttrdate)
                      this.spieler.getSpielerListeByMyTTId(new_spieler.mytt_id).forEach( spieler1 => {
                        spieler1.qttrdate = new Date(spieler.qttrdate)
                      })
                    // Special case for qttrinfo which is set for all spieler with the same mytt_id
                    } else if (spieler_key === 'qttrinfo') {
                      new_spieler[spieler_key] = spieler[spieler_key]
                      this.spieler.getSpielerListeByMyTTId(new_spieler.mytt_id).forEach( spieler1 => {
                        spieler1[spieler_key] = spieler[spieler_key]
                      })
                    // Default case for all other properties
                    } else {
                      new_spieler[spieler_key] = spieler[spieler_key]
                    }
                  }
                }
              }
            })
          }
        /* set bilanzen properties */
        } else if (key == "bilanzen") {
          for (var bilanzen_key in planung_json.bilanzen) { 
            /* special case for saisons which are merged with the current saisons array */
            if (bilanzen_key === "saisons" && this.bilanzen.hasOwnProperty("saisons") ) {
              planung_json.bilanzen.saisons.forEach(saison => {
                if ( this.bilanzen.saisons.indexOf(saison) === -1 ) {
                  this.bilanzen.saisons.push(saison)
                }
              })
              this.bilanzen.saisons.sort(COMPARE_HALBSERIEN)
            } else {
              this.bilanzen[key] = planung_json.bilanzen[key]
            }
          }
        /* Do not load allow_commit */
        } else if (key == "allow_commit") {

        /* Set other planungs properties */ 
        } else {
          this[key] = planung_json[key]
        }
      }
    }
    // Special case for TTR Date
    if ("ttrwerte" in planung_json && "date" in planung_json.ttrwerte) {
      this.ttrwerte.date = new Date(planung_json.ttrwerte.date)
    }
    // bilanzen + ttrwerte status
    this._setTtrwerteStatus()
    this._setBilanzenStatus()
    // Check if we need to recompute aufstellung
    if ( update_aufstellung ) {
      this.spieler.cleanUp()
      this.spieler.validate()
      this.mannschaften.deleteEmptyMannschaften(this.spieler.liste)
      this.validateAllMannschaften()
    }
    if ( qttr_values_changed ) {
      this.spieler.validate()
    }
    this._enableCommit()
  }

  getPlanungAsJsonString() {
    const store_planung = jQuery.extend({}, this);
    store_planung.allow_commit = false
    return JSON.stringify(store_planung)
  }

  /**
   *  Private
   */
  _checkMannschaftInvalid(spielklasse, mannschaft){
    this.mannschaften.checkMannschaftInvalid(spielklasse, mannschaft, this.spieler.getSpielerOfMannschaft(spielklasse, mannschaft))
  }

  _enableCommit() {
    this.allow_commit = true
  }

  _disableCommit() {
    this.allow_commit = false
  }

  _commit(tag="") {
    if ( this.allow_commit === true ) {
      this._updateUrlStrings()
      // remove a possibly set tag as we now have changed the planung and the tag is not there any more
      this.tag = tag
      // trigger view update
      this.onMannschaftenChanged()
      this.onHeaderDataChanged(this)
      this.onFooterDataChanged()
      // store planung
      this._storePlanung()
    }
  }

  _storePlanung(){
    // store this object
    localStorage.setItem("localStoragePlanung", JSON.stringify(this))
    localStorage.setItem('localStorageVereinsInfos',JSON.stringify({'verein':this.verein,'verband':this.verband,'vereinsNummer':this.vereinsNummer}))
    this.onPlanungStored(this)
  }

  _isEmpty() {
    return (  this.verein === "" &&
              this.verband === "" &&
              this.vereinsNummer === 0 &&
              this.saison === "" &&
              this.halbserie === "" &&
              this.spielklasse === "")
  }

  _updateUrlStrings() {
    // compute the correct url strings
    this.url = {
      verein: GET_URL_SLUG_OF_VEREIN(this.verein),
      saison: this._getPreviousSaison().replace("/","-").substring(2),
      halbserie: this._getOtherHalbserie().replace("Vorrunde","vr").replace("Rückrunde","rr"),
      spielklasse: this._getSpielklassenUrlSlug(this.spielklasse)
    }
    // update urls
    this.aufstellung.url = this._getAufstellungsUrl()
    this.ttrwerte.url = this._getTtrRanglisteUrl()
    this.bilanzen.url = this._getBilanzenUrl()
  }

  _getAufstellungsUrl() {
    var spielklasse_halbserie = `details/${this.url.spielklasse}/${this.url.halbserie}/`
    if (! this.url.spielklasse ) {
      spielklasse_halbserie = "/"
    }
    return `https://www.mytischtennis.de/clicktt/${this.verband}/${this.url.saison}/verein/${this.vereinsNummer}/${this.url.verein}/mannschaftsmeldungen${spielklasse_halbserie}`
  }

  _getTtrRanglisteUrl() {
    return `https://www.mytischtennis.de/community/ranking?vereinid=${this.vereinsNummer},${this.verband}&ttrQuartalorAktuell=quartal&alleSpielberechtigen=yes`
  }

  _getBilanzenUrl() {
    return `https://www.mytischtennis.de/clicktt/${this.verband}/${this.url.saison}/verein/${this.vereinsNummer}/${this.url.verein}/bilanzen/${this.url.halbserie}/`
  }

  _getSpielklassenUrlSlug(spielklasse) {
    for (var group_id of Object.keys(SPIELKLASSEN)) {
      var group = SPIELKLASSEN[group_id]
      if ( group.hasOwnProperty(spielklasse) ) {
        return group[spielklasse].url_slug
      }
    }
    return ""
  }
}
