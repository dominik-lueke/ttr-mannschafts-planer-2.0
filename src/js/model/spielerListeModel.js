class SpielerListeModel {

  constructor(spielklasse) {
    this.spielklasse = spielklasse
    this.liste = []
  }

  /**
   *  Public Functions 
   */

  addSpieler(mannschaft, position, name, qttr) {
    const id = this.liste.length > 0 ? Math.max.apply(null, this.liste.map(spieler => spieler.id)) + 1 : 1
    // add the spieler 
    const spieler = new SpielerModel(id, name, this.spielklasse, qttr)
    this.liste.push(spieler)
    // insert the new spieler in the correct (mannschaft, position)
    this._insertSpielerInMannschaft(spieler, mannschaft, position)
  }

  reorderSpieler(id, new_mannschaft, new_position) {
    const spieler = this.liste.find(spieler => spieler.id == id)
    // keep primary spv of spieler if it is reordered in the same mannschaft. Else delete it
    var keep_spv = spieler.mannschaft == new_mannschaft
    // reorder = remove from old position + insert in new position
    this._removeSpielerFromMannschaft(spieler, keep_spv)
    this._insertSpielerInMannschaft(spieler, new_mannschaft, new_position)
  }

  editSpielerSpv(id, spv) {
    const spieler = this.liste.find(spieler => spieler.id == id)
    // set the primary Spv for this spieler and the secondary for all with higher positionen in the same mannschaft
    this._setPrimarySpvForSpieler(spieler, spv)
  }

  editSpielerQttr(id, qttr) {
    const spieler = this.liste.find(spieler => spieler.id == id)
    this._setQttrForSpieler(spieler, qttr)
  }

  deleteSpieler(id) {
    // first remove the spieler from its mannschaft to keep the spieler array correct
    this._removeSpielerFromMannschaft(spieler, false)
    // delete the spieler object
    this.liste = this.liste.filter(spieler => spieler.id !== id )
  }

  /**
   * Internal Manipulate Spieler Array Functions
   */

  _insertSpielerInMannschaft(insert_spieler, mannschaft, position) {
    this.liste
    .filter( spieler => ( spieler.mannschaft == mannschaft && spieler.position >= position ) )
    .forEach( spieler => {
      // increase all positionen from the same mannschaft greater or equal than position by one
      spieler.position++
      // also check if any of the positionen has a sperrvermerk and increase our secondary if so
      if (spieler.spv.primary) { insert_spieler.spv.secondary++ }
    } )
    // put the insert_spieler in new position
    insert_spieler.mannschaft = mannschaft
    insert_spieler.position = position
    // Sort this.liste
    this.liste = this.liste.sort((a,b) => a.compare(b))
    // Update secondary spv for all spieler in the same mannschaft with higher positionen if we have a primary spv
    if ( insert_spieler.spv.primary ) {
      this._updateSpvPreviousPositionOfSpieler(insert_spieler, true)
    }
    // recompute ttrdifferenz for the new position
    this._recomputeTtrDifferenzForSpieler(insert_spieler)
    // check if any ttrdifferenzen are now invalid
    this._checkTtrDifferenzenForSpieler(insert_spieler)
  }

  _removeSpielerFromMannschaft(remove_spieler, keep_spv=false){
    // Save current spieler position
    const old_mannschaft = remove_spieler.mannschaft
    const old_position = remove_spieler.position
    // Save the next_spieler for which we have to recompute the ttrdifferenz
    const next_spieler = this._getNextSpieler(remove_spieler)
    // handle sperrvermerk before the spieler gets updated
    if ( remove_spieler.spv.primary ) {
      if ( keep_spv ) {
      // Remove secondary spv from all spieler in the same mannschaft with higher positionen
      this._updateSpvPreviousPositionOfSpieler(remove_spieler, false)
      } else {
        // Remove primary spv from this spieler and secondary spv all spieler in the same mannschaft with higher positionen
        this._setPrimarySpvForSpieler(remove_spieler, false)
      }
    }
    // Reset our secondary spv counter when we leave a mannschaft
    remove_spieler.spv.secondary = 0
    // Give the spieler the position 0.0
    remove_spieler.mannschaft = 0
    remove_spieler.position = 0
    // decrease all positionen from mannschaft greater than position by one
    this.liste
    .filter( spieler => ( spieler.spielklasse == remove_spieler.spielklasse && spieler.mannschaft == old_mannschaft && spieler.position >= old_position ) )
    .forEach( spieler => { spieler.position-- } )
    // reorder this.liste
    this.liste = this.liste.sort((a,b) => a.compare(b))
    // recompute ttrdifferenz for the new position
    if (next_spieler) {
      this._recomputeTtrDifferenzForSpieler(next_spieler)
    }
    // remove this spieler from all invalid lists of other spieler
    this._removeSpielerFromInvalidLists(remove_spieler)
  }

  /**
   *  Ttr Functions
   */

  /* Recompute the Ttr Differenz for this spieler
    and the one directly behind it */
  _recomputeTtrDifferenzForSpieler(spieler) {
    // update this spieler
    const previousSpieler = this._getPreviousSpieler(spieler)
    const prev_ttr = ( previousSpieler !== null ) ? previousSpieler.qttr : -1
    spieler.ttrdifferenz = (prev_ttr > -1) ? spieler.qttr - prev_ttr: 0
    // update next spieler
    const nextSpieler = this._getNextSpieler(spieler)
    if ( nextSpieler !== null ) {
      nextSpieler.ttrdifferenz = nextSpieler.qttr - spieler.qttr
    }
  }

  /* Check if the given check_spieler is invalid 
    because of spieler with higher position 
    and check if all spieler with higher positionen 
    are invalid because of the check_spieler */
  _checkTtrDifferenzenForSpieler(check_spieler) {
    check_spieler.resetInvalidList()
    this._checkTtrDifferenzenAgainstHigherPositionenForSpieler(check_spieler)
    this._checkTtrDifferenzenAgainstLowerPositionenForSpieler(check_spieler)
  }

  /* Check if the given check_spieler is invalid 
    because of spieler with higher position */
  _checkTtrDifferenzenAgainstHigherPositionenForSpieler(check_spieler){
    // Check if this spieler is invalid because of any positionen higher than its own
    this.liste
    .filter(spieler => (
      ( spieler.mannschaft == check_spieler.mannschaft && spieler.position < check_spieler.position ) || ( spieler.mannschaft < check_spieler.mannschaft ) ) &&
      spieler.qttr < check_spieler.qttr)
    .forEach(spieler => {
      if ( check_spieler.isInvalidBecauseOf(spieler)) {
        check_spieler.addSpielerToInvalidList(spieler)
      }
    })
  }

  /* Check if the given check_spieler is invalid 
    because of spieler with higher position */
  _checkTtrDifferenzenAgainstLowerPositionenForSpieler(check_spieler){
    // Check if this spieler is invalid because of any positionen higher than its own
    this.liste
    .filter(spieler => (
      ( spieler.mannschaft == check_spieler.mannschaft && spieler.position > check_spieler.position ) || ( spieler.mannschaft > check_spieler.mannschaft ) ) &&
      spieler.qttr > check_spieler.qttr)
    .forEach(spieler => {
      if ( spieler.isInvalidBecauseOf(check_spieler) ) {
        spieler.addSpielerToInvalidList(check_spieler)
      }
    })
  }

  /* Remove the given Spieler from all invalid lists
    of other spieler with lower positionen the spieler itself */
  _removeSpielerFromInvalidLists(remove_spieler){
    this.liste
    .filter(spieler => ( spieler.invalid.find( invalid_spieler => invalid_spieler.id == remove_spieler.id )))
    .forEach(spieler => {
      spieler.removeSpielerFromInvalidList(remove_spieler)
    })
  }

  /**
   * Sperrvermerk Functions
   */

  /* Set the primary spv for the given spieler and 
    also update all scondary spv on spieler with 
    higher positionen in the same mannschaft */
  _setPrimarySpvForSpieler(spieler, spv) {
    // Set the Spv of this Spieler
    spieler.spv.primary = spv
    // recompute the ttr differenzen and update invalid lists (this will add or remove spieler to invalid lists)
    this._checkTtrDifferenzenForSpieler(spieler)
    // Check if other Spieler in the same Mannschaft and with higher Positionen also need an Spv now
    this._updateSpvPreviousPositionOfSpieler(spieler, spv)
  }

  /* Recursivly increase (spv_spieler.spv.primary == true) or decrease 
    the secondary Spv counter of the previous spieler in the same 
    mannschaft than spv_spieler.
    Also set the primary spv if the previous spieler would need one 
    because it is invalid */
  _updateSpvPreviousPositionOfSpieler(spv_spieler) {
    const prev_spieler = this._getPreviousSpieler(spv_spieler)
    if ( prev_spieler && ( prev_spieler.mannschaft == spv_spieler.mannschaft) ) {
      prev_spieler.spv.secondary += ( spv_spieler.spv.primary || spv_spieler.spv.secondary > 0 ) ? 1 : -1
      if ( ( prev_spieler.invalidSpielerFromHigherMannschaften > 0 ) && ! prev_spieler.spv.primary ) {
        this._setPrimarySpvForSpieler(prev_spieler, spv_spieler.spv.primary)
      } else {
        this._updateSpvPreviousPositionOfSpieler(prev_spieler)
      }
    }
  }

  /**
   * QTTR FUNCTIONS
   */

  _setQttrForSpieler(spieler, qttr){
    spieler.qttr = qttr
    this._recomputeTtrDifferenzForSpieler(spieler)
    this._checkTtrDifferenzenForSpieler(spieler)
  }

  /**
   * Array Functions
   */

  _getPreviousSpieler(spieler){
    const prev_index = this.liste.indexOf(spieler) - 1
    if (prev_index > -1){
      const prev_spieler = this.liste[prev_index]
      return ( prev_spieler.mannschaft > 0 && prev_spieler.position > 0) ? prev_spieler : null
    }
    return null
  }

  _getNextSpieler(spieler){
    const next_index = this.liste.indexOf(spieler) + 1
    return ( next_index < this.liste.length ) ? this.liste[next_index] : null
  }

}