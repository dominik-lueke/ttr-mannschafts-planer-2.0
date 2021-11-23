class SpielerModel {

  constructor(id=0, name="", spielklasse="", qttr=1) {
    this.id = id
    this.mytt_id = 0
    this.name = name
    this.spielklasse = spielklasse
    this.mannschaft = 0
    this.position = 0
    this.qttr = qttr
    this.qttrdate = new Date(Date.now())
    this.qttrinfo = `Manuell eingetragen am ${this.qttrdate.getDate()}.${this.qttrdate.getMonth()+1}.${this.qttrdate.getFullYear()}`
    this.ttrdifferenz = 0
    this.farbe = "default"
    this.jahrgang = ""
    this.reserve = false
    this.sbe = false
    this.spv = {
      primary: false, // A primary spv is set because the spieler would be invalid without the spv in terms of ttr difference
      secondary: 0    // A secondary spv is set because the spieler is before on teammate with a primary spv. 
                      // The number counts how many teammates with primary spv are behind this spieler
                      // 0 means no secondary spv
    }
    this.kommentar = ""
    this.invalid = [] // Store all players because of which this spieler is invalid
    this.invalidSpielerFromHigherMannschaften = 0 // Store how many spieler because of which we are invalid are from higher mannschaften
    this.wrongAgeForSpielklasse = false
    this.bilanzen = {}
    /*
    {
      Vorrunde-20xx/xy": {
        saison: 20xx/xy,
        halbserie: Vorrunde,
        position: "1.1",
        bilanzen: [
          {
            einsatz_mannschaft: "Herren",
            name: "Nachname, Vorname"
            rang: "1.1",
            einsaetze: 1,
            1: "1:1",
            2: "2:2",
            3: "",
            4: "",
            5: "",
            6: "",
            gesamt: "3:3",
          },
          {

          }
        ]
      }
    }
    */
  }

  /**
   * PUBLIC
   */

  /**
   * return the url to the spielers ttr-rangliste, if a myttid is set.
   * else return y link to the personen suche of mytischtennis
   */
  getMyTTUrl(){
    if ( this.mytt_id !== 0 ){
      return `https://www.mytischtennis.de/community/events?personId=${this.mytt_id}`
    } else {
      const vorname_nachname = this.name.split(',')
      if (vorname_nachname.length == 2) {
        const url_vorname = vorname_nachname[1].trim().replace(' ', '+')
        const url_nachname = vorname_nachname[0].trim().replace(' ', '+')
        return `https://www.mytischtennis.de/community/ranking?panel=2&vorname=${url_vorname}&nachname=${url_nachname}&vereinIdPersonenSuche=&vereinPersonenSuche=Verein+suchen&goAssistentP=Anzeigen`
      } else {
        return ''
      }
    }
  }

  isInvalidBecauseOf(other_spieler) {
    // Special Case for if one of the two hast qttr 0. Then it is not invalid
    if (this.qttr === 0 || other_spieler.qttr === 0 ){
      return false
    }
    const allowed_delta = this._getAllowedTtrDifferenz(other_spieler)
    const differenz = this.getTtrDifferenz(other_spieler)
    // add to invalid list if 
    // a) differenz is too high AND
    // b) the check_spieler has no spv OR the spieler are in the same mannschaft
    return ( differenz > allowed_delta && ( ! ( this.spv.primary || this.spv.secondary > 0 ) || this.mannschaft == other_spieler.mannschaft ) )
  }

  getTtrDifferenz(other_spieler) {
    return this.qttr - other_spieler.qttr
  }

  compare(other_spieler) {
    const spielklasse_compare = this.spielklasse.localeCompare(other_spieler.spielklasse)
    return spielklasse_compare !== 0 ? spielklasse_compare : ( this.mannschaft * 1000 + this.position ) - ( other_spieler.mannschaft * 1000 + other_spieler.position )
  }

  addSpielerToInvalidList(invalid_spieler) {
    this.invalid = this.invalid.filter(spieler => (spieler.id !== invalid_spieler.id) )
    this.invalid.push({
      id: invalid_spieler.id,
      mannschaft: invalid_spieler.mannschaft,
      position: invalid_spieler.position,
      name: invalid_spieler.name,
      differenz: this.getTtrDifferenz(invalid_spieler)
    })
    this.invalidSpielerFromHigherMannschaften = this.invalid.filter(invalid_spieler => (invalid_spieler.mannschaft != this.mannschaft)).length
  }

  removeSpielerFromInvalidList(remove_spieler) {
    this.invalid = this.invalid.filter(invalid_spieler => ( invalid_spieler.id !== remove_spieler.id ))
    this.invalidSpielerFromHigherMannschaften = this.invalid.filter(invalid_spieler => (invalid_spieler.mannschaft != this.mannschaft)).length
  }

  resetInvalidList(){
    this.invalid = []
    this.invalidSpielerFromHigherMannschaften = 0
  }

  clearPosition(){
    this.mannschaft = 9999
    this.position = 9999
    this.qttr = 0
    this.reserve = false
    this.sbe = false
    this.spv = {
      primary: false, // A primary spv is set because the spieler would be invalid without the spv in terms of ttr difference
      secondary: 0    // A secondary spv is set because the spieler is before on teammate with a primary spv. 
                      // The number counts how many teammates with primary spv are behind this spieler
                      // 0 means no secondary spv
    }
    this.invalid = [] // Store all players because of which this spieler is invalid
    this.invalidSpielerFromHigherMannschaften = 0
  }


  /**
   * PRIVATE
   */

  _getAllowedTtrDifferenz(other_spieler) {
    var delta = this.mannschaft == other_spieler.mannschaft ? TTR_TOLERANZ_INTERN : TTR_TOLERANZ
    // Add Jugend Bonus
    var jugend_spielklasse = false
    JUGEND_SPIELKLASSEN.forEach(spielklasse => {
      jugend_spielklasse = this.spielklasse.match(new RegExp(`${spielklasse}.*`))
    })
    delta += ( this.sbe || other_spieler.sbe || jugend_spielklasse ) ? TTR_TOLERANZ_JUGEND_BONUS : 0
    // Add D-Kader Bonus
    delta += ( this.dkader || other_spieler.dkader ) ? TTR_TOLERANZ_DKADER_BONUS : 0
    // return allowed delta
    return delta
  }

}