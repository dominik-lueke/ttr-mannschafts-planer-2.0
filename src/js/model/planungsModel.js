class PlanungsModel {

  constructor(verein="", verband="", vereinsNummer="", saison="", halbserie="", qttrDatum="", spielklasse="") {
    this.verein = verein
    this.verband = verband
    this.vereinsNummer = vereinsNummer
    this.saison = saison
    this.halbserie = halbserie
    this.qttrDatum = qttrDatum
    this.spielklasse = spielklasse
    this.url = {
      verein: this.verein.replace(/ /g,"-").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue"),
      saison: this._getPreviousSaison().replace("/","-").substring(2),
      halbserie: this._getOtherHalbserie().replace("Vorrunde","vr").replace("Rückrunde","rr"),
      spielklasse: this.spielklasse.substring(0,1) // Only works for Herren H and Damen D
    }
    this.mytt = {
      aufstellung: {
        url: this._getAufstellungsUrl(),
        status: "offline"
      },
      qttr: {
        url: "TODO",
        status: "offline",
        date: new Date(0,0)
      }
    }

    this.mannschaften = new MannschaftsListeModel(this.spielklasse)
    this.spieler = new SpielerListeModel(this.spielklasse)

    this.onMannschaftenChanged = () => {}
    this.onHeaderDataChanged = () => {}
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
    this._commit()
  }

  decreaseSerie(){
    this.halbserie = this._getOtherHalbserie()
    this.saison = this._getPreviousSaison()
    this._commit()
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

  loadFromJSON (planung_json, update_aufstellung=false) {
    const current_anzahl_mannschaften = this.mannschaften.liste.length
    if (update_aufstellung){
      this.spieler.clearAllSpielerPositionen()
    }
    for (var key in planung_json) {
      if (planung_json.hasOwnProperty(key)) {

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
              if ( ! update_aufstellung) {
                new_mannschaft = new MannschaftsModel()
                mannschaftsListe.liste.push(new_mannschaft)
              } else if ("nummer" in mannschaft) {
                if ( (mannschaft.nummer <= this.mannschaften.liste.length) ) {
                  new_mannschaft = this.mannschaften.getMannschaftByNummer(mannschaft.nummer)
                } else {
                  const new_mannschaft_id = this.addMannschaft(mannschaft.nummer)
                  new_mannschaft = this.mannschaften.getMannschaft(new_mannschaft_id)
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
              if ( ! update_aufstellung ) {
                new_spieler = new SpielerModel()
                spielerListe.liste.push(new_spieler)
              } else if ("mytt_id" in spieler) {
                new_spieler = this.spieler.getSpielerByMyTTId(spieler.mytt_id)
                if ( typeof new_spieler === 'undefined' && "name" in spieler) {
                  new_spieler = this.spieler.getSpielerByName(spieler.name)
                  if ( typeof new_spieler === 'undefined' ) {
                    const new_spieler_id = this.spieler.addSpieler(spieler.mannschaft, spieler.position, spieler.name)
                    new_spieler = this.spieler.getSpieler(new_spieler_id)
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
          this[key] = planung_json[key]
        }
      }
    }
    if ( update_aufstellung ) {
      this.spieler.cleanUp()
      this.spieler.validate()
      for (var i = current_anzahl_mannschaften; i > planung_json.mannschaften.liste.length; i--) {
        this.mannschaften.deleteMannschaftByNummer(i)
      }
      this.validateAllMannschaften()
    }
    this._commit()
    return this
  }

  /**
   *  Private
   */

   _commit() {
    this._updateUrlStrings()
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften.liste, this.spieler.liste)
    this.onHeaderDataChanged(this)
    // store this object
    localStorage.setItem("localStoragePlanung", JSON.stringify(this))
   }

  _updateUrlStrings() {
    this.url = {
      verein: this.verein.replace(/ /g,"-").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue"),
      saison: this._getPreviousSaison().replace("/","-").substring(2),
      halbserie: this._getOtherHalbserie().replace("Vorrunde","vr").replace("Rückrunde","rr"),
      spielklasse: this.spielklasse.substring(0,1) // Only works for Herren H and Damen D
    }
    this.mytt.aufstellung.url = this._getAufstellungsUrl()
  }

  _getAufstellungsUrl() {
    return `https://www.mytischtennis.de/clicktt/${this.verband}/${this.url.saison}/verein/${this.vereinsNummer}/${this.url.verein}/mannschaftsmeldungendetails/${this.url.spielklasse}/${this.url.halbserie}/`
  }
}
