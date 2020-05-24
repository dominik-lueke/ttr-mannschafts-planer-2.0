class PlanungsModel {

  constructor(verein="", verband="", vereinsNummer="", saison="", halbserie="", spielklasse="") {
    // HEADER DATA
    this.verein = verein
    this.verband = verband
    this.vereinsNummer = vereinsNummer
    this.saison = saison
    this.halbserie = halbserie
    this.spielklasse = spielklasse
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
    this.mannschaften = new MannschaftsListeModel(this.spielklasse)
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

  addMannschaft(nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche){
    // add the mannschaft
    const new_id = this.mannschaften.addMannschaft(nummer, liga, sollstaerke, spieltag, uhrzeit, spielwoche)
    // Check for the last two mannschaften if they are invalid now
    this.mannschaften.liste
    .filter(mannschaft => mannschaft.nummer >= this.mannschaften.liste.length - 1)
    .forEach(mannschaft => {
      this.mannschaften.checkMannschaftInvalid(mannschaft.nummer, this.spieler.getSpielerOfMannschaft(mannschaft.nummer))
    })
    // commit
    this._commit()
    // return new id
    return new_id
  }

  deleteMannschaft(id, keep_spieler){
    const mannschafts_nummer = (this.mannschaften.getMannschaft(id)).nummer
    // delete tha mannschaft from spieler-liste
    this.spieler.deleteMannschaft(mannschafts_nummer, keep_spieler)
    // delete the mannschaft from mannschafts-liste
    this.mannschaften.deleteMannschaft(id)
    // Check for the last mannschaft if it is (in)valid now
    this.mannschaften.liste
    .filter(mannschaft => mannschaft.nummer > this.mannschaften.liste.length - 1)
    .forEach(mannschaft => {
      this.mannschaften.checkMannschaftInvalid(mannschaft.nummer, this.spieler.getSpielerOfMannschaft(mannschaft.nummer))
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

  editMannschaftKommentar(id, kommentar) {
    this.mannschaften.editMannschaftKommentar(id, kommentar)
    // commit
    this._commit()
  }

  validateMannschaft(nummer) {
    this.mannschaften.checkMannschaftInvalid(nummer, this.spieler.getSpielerOfMannschaft(nummer))
  }

  validateAllMannschaften() {
    this.mannschaften.liste.forEach(mannschaft => {
      this.validateMannschaft(mannschaft.nummer)
    })
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

  reorderMannschaft(mannschaft_nummer, new_mannschaft_nummer) {
    // reorder mannschaften
    this.mannschaften.reorderMannschaftByNummer(mannschaft_nummer, new_mannschaft_nummer)
    // set new mannschaften for spieler
    const temp_number = -1
    this.spieler.reorderMannschaft(mannschaft_nummer,temp_number)
    if ( mannschaft_nummer < new_mannschaft_nummer ) {
      for (var i=mannschaft_nummer+1; i<=new_mannschaft_nummer; i++) {
        this.spieler.reorderMannschaft(i,i-1)
      }
    } else {
      for (var i=mannschaft_nummer-1; i>=new_mannschaft_nummer; i--) {
        this.spieler.reorderMannschaft(i,i+1)
      }
    }
    this.spieler.reorderMannschaft(temp_number,new_mannschaft_nummer)
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

  editSpielerGeburtsdatum(id, geburtsdatum) {
    this.spieler.editSpielerGeburtsdatum(id, geburtsdatum)
    // commit
    this._commit()
  }

  editSpielerRes(id, res) {
    this.spieler.editSpielerRes(id, res)
    // check if the mannschaft is no (in)valid
    const mannschaft = this.spieler.getSpieler(id).mannschaft
    this.mannschaften.checkMannschaftInvalid(mannschaft, this.spieler.getSpielerOfMannschaft(mannschaft))
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
      this._commit()
      // the commit erases a possibly loaded tag since it assumes the planung has changed
      // and therefor the tag is on the previous version of the planung
      // therefore we restore it here if necessary
      if (planung_json.hasOwnProperty('tag')) {
        this.setTag(planung_json.tag)
      }
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

    // set spielklasse also for mannschaften and spieler
    if (planung_json.hasOwnProperty("spielklasse")) {
      this.spieler.spielklasse = planung_json.spielklasse
      this.mannschaften.spielklasse = planung_json.spielklasse
      // reset mannschaften, spieler, bilanzen if we change the spielklasse
      if (this.spielklasse !== planung_json.spielklasse) {
        this.mannschaften.liste = []
        this.bilanzen.saisons = []
      }
    }

    // set saison also for spieler
    if (planung_json.hasOwnProperty("saison")) {
      this.spieler.saison = planung_json.saison
    }

    if (update_aufstellung){
      this.spieler.clearAllSpielerPositionen()
    }

    var qttr_values_changed = false
    const current_anzahl_mannschaften = this.mannschaften.liste.length

    for (var key in planung_json) {
      if (this.hasOwnProperty(key)) {

        /* Load MannschaftsListe */
        if ( key == "mannschaften") {
          const mannschaftsListe = this.mannschaften
          /* Set Spielklasse */
          if (planung_json.hasOwnProperty("spielklasse") ) {
            mannschaftsListe.spielklasse = planung_json.spielklasse
          }
          if ( planung_json.mannschaften.hasOwnProperty("liste") ) {
            /* Load Mannschaften */
            planung_json.mannschaften.liste.forEach( (mannschaft) => {
              /* Create Mannschaft */
              var new_mannschaft = null
              if (mannschaftsListe.spielklasse === mannschaft.spielklasse){
                if ( ! update_aufstellung) {
                  if ("romanNumber" in mannschaft) {
                    new_mannschaft = this.mannschaften.getMannschaftByRomanNumber(mannschaft.romanNumber)
                  } else {
                    new_mannschaft = new MannschaftsModel()
                    mannschaftsListe.liste.push(new_mannschaft)
                  }
                } else if ("nummer" in mannschaft) {
                  if ( (mannschaft.nummer <= this.mannschaften.liste.length) ) {
                    new_mannschaft = this.mannschaften.getMannschaftByNummer(mannschaft.nummer)
                  } else {
                    const new_mannschaft_id = this.addMannschaft(mannschaft.nummer)
                    new_mannschaft = this.mannschaften.getMannschaft(new_mannschaft_id)
                  }
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
          const spielerListe = this.spieler
          /* Set Spielklasse */
          if ( planung_json.hasOwnProperty("spielklasse") ) {
            spielerListe.spielklasse = planung_json.spielklasse
          }
          /* Load Spieler */
          if ( planung_json.spieler.hasOwnProperty("liste") ) {
            planung_json.spieler.liste.forEach( (spieler) => {
              /* Create Spieler */
              var new_spieler = undefined
              // try to find spieler by mytt_id
              new_spieler = this.spieler.getSpielerByMyTTId(spieler.mytt_id)
              if ( typeof new_spieler === 'undefined') {
                // try to find spieler by internal id
                if ( "id" in spieler ) {
                  new_spieler = this.spieler.getSpieler(spieler.id)
                }
                if ( typeof new_spieler === 'undefined' ) {
                  if ( update_aufstellung ) {
                    // spieler not there yet and we want to update the aufstellung, create a new one
                    const new_spieler_id = this.spieler.addSpieler(spieler.mannschaft, spieler.position, spieler.name)
                    new_spieler = this.spieler.getSpieler(new_spieler_id)
                  }
                }
              }
              /* Set properties */
              if ( !( typeof new_spieler === 'undefined') ){
                for (var spieler_key in new_spieler){
                  if (spieler.hasOwnProperty(spieler_key)){
                    // Special case for bilanzen where we extend the hashmap
                    if (spieler_key === 'bilanzen') {
                      for (var saison_key in spieler[spieler_key] ){
                        new_spieler[spieler_key][saison_key] = spieler[spieler_key][saison_key]
                      }
                    } else if (spieler_key === 'qttrdate') {
                      new_spieler.qttrdate = new Date(spieler.qttrdate)
                    } else {
                      new_spieler[spieler_key] = spieler[spieler_key]
                      qttr_values_changed = qttr_values_changed || spieler_key == "qttr"
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
      for (var i = current_anzahl_mannschaften; i > planung_json.mannschaften.liste.length; i--) {
        this.mannschaften.deleteMannschaftByNummer(i)
      }
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
  _enableCommit() {
    this.allow_commit = true
  }

  _disableCommit() {
    this.allow_commit = false
  }

  _commit() {
    if ( this.allow_commit === true ) {
      this._updateUrlStrings()
      // remove a possibly set tag as we now have changed the planung and the tag is not there any more
      this.tag = ""
      // trigger view update
      this.onMannschaftenChanged(this)
      this.onHeaderDataChanged(this)
      this.onFooterDataChanged()
      // store planung
      this._storePlanung()
    }
  }

  _storePlanung(){
    // store this object
    localStorage.setItem("localStoragePlanung", JSON.stringify(this))
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
    return `https://www.mytischtennis.de/clicktt/${this.verband}/${this.url.saison}/verein/${this.vereinsNummer}/${this.url.verein}/mannschaftsmeldungendetails/${this.url.spielklasse}/${this.url.halbserie}/`
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
