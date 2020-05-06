class SpielerModel {

  constructor(id=0, name="", spielklasse="", qttr=1) {
    this.id = id
    this.mytt_id = 0
    this.name = name
    this.spielklasse = spielklasse
    this.mannschaft = 0
    this.position = 0
    this.qttr = qttr
    var today = new Date(Date.now())
    this.qttrinfo = `Manuell eingetragen am ${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`
    this.ttrdifferenz = 0
    this.farbe = "default"
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
    this.bilanzen = {}
    /*
    {
      Vorrunde-20xx/xy": {
        saison: 20xx/xy,
        halbserie: Vorrunde,
        bilanzen: [
          {
            mannschaft: 1,
            liga: "Liga",
            einsaetze: 1,
            bilanzen: {
              1: "1:1",
              2: "2:2",
              3: "",
              4: "",
              5: "",
              6: "",
              gesamt: "3:3",
            }
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
    return ( this.mannschaft * 1000 + this.position ) - ( other_spieler.mannschaft * 1000 + other_spieler.position )
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
    var delta = this.mannschaft == other_spieler.mannschaft ? 35 : 50
    delta += this.sbe || other_spieler.sbe ? 35 : 0
    return delta
  }

}