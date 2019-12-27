class Model {
  constructor() {
    this.planung = {
        verein: "TuRa Elsen",
        vereinsNummer: 187012,
        saison: "2019/20",
        halbserie: "Rückrunde",
        qttrDatum: "11.12.2019",
        spielklasse: "Herren"
    }

    this.mannschaften = [
      { 
        spielklasse: "Herren",
        nummer: 1,
        liga: "Verbandsliga",
        sollstaerke: 6,
        spieltag: "Samstag",
        uhrzeit: "18:30",
        spielwoche: "A",
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
      },
      { 
        spielklasse: "Herren",
        nummer: 2,
        liga: "Landesliga",
        sollstaerke: 6,
        spieltag: "Samstag",
        uhrzeit: "18:30",
        spielwoche: "B",
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
      }
    ]

    this.spieler = [
      {
        id: 1,
        name: "Nachname, Vorname1",
        spielklasse: "Herren",
        mannschaft: 1,
        position: 1,
        qttr: 1900,
        ttrdifferenz: 0,
        farbe: "",
        spv: false,
        reserve: false,
        spv: {
          primary: false,
          secondary: 0
        },
        kommentar: "",
        invalid: []
      },
      {
        id: 2,
        name: "Nachname, Vorname2",
        spielklasse: "Herren",
        mannschaft: 1,
        position: 2,
        qttr: 1890,
        ttrdifferenz: -10,
        farbe: "",
        spv: {
          primary: false,
          secondary: 0
        },
        reserve: false,
        sbe: false,
        kommentar: "",
        invalid: []
      },
      {
        id: 3,
        name: "Nachname, Vorname3",
        spielklasse: "Herren",
        mannschaft: 1,
        position: 3,
        qttr: 1880,
        ttrdifferenz: -10,
        farbe: "",
        spv: false,
        reserve: false,
        spv: {
          primary: false,
          secondary: 0
        },
        kommentar: "",
        invalid: []
      },
      {
        id: 4,
        name: "Nachname, Vorname4",
        spielklasse: "Herren",
        mannschaft: 1,
        position: 4,
        qttr: 1870,
        ttrdifferenz: -10,
        farbe: "",
        spv: false,
        reserve: false,
        spv: {
          primary: false,
          secondary: 0
        },
        kommentar: "",
        invalid: []
      },
      {
        id: 5,
        name: "Nachname, Vorname5",
        spielklasse: "Herren",
        mannschaft: 2,
        position: 1,
        qttr: 1920,
        ttrdifferenz: +50,
        farbe: "",
        spv: {
          primary: false,
          secondary: 0
        },
        reserve: false,
        sbe: false,
        kommentar: "",
        invalid: []
      },
      {
        id: 6,
        name: "Nachname, Vorname6",
        spielklasse: "Herren",
        mannschaft: 2,
        position: 2,
        qttr: 1930,
        ttrdifferenz: +90,
        farbe: "",
        spv: {
          primary: false,
          secondary: 0
        },
        reserve: false,
        sbe: false,
        kommentar: "",
        invalid: []
      }
    ]
    this._checkTtrDifferenzenForPosition("Herren", 2, 1)
    this._checkTtrDifferenzenForPosition("Herren", 2, 2)
  }

  /*
  * Validity Checks for Spieler
  */
  _checkTtrDifferenzenForPosition(spielklasse, mannschaft, position){
    const check_spieler = this.spieler.find( spieler => ( spieler.spielklasse == spielklasse && spieler.mannschaft == mannschaft && spieler.position == position ) )
    check_spieler.invalid = []
    // Check if this spieler is invalid because of any positionen higher than its own
    this.spieler
    .filter(spieler => ( 
      spieler.spielklasse == spielklasse && 
      ( spieler.mannschaft == mannschaft && spieler.position < position ) || ( spieler.mannschaft < mannschaft ) ) &&
      spieler.qttr < check_spieler.qttr)
    .forEach(spieler => {
      var delta = spieler.mannschaft == mannschaft ? 35 : 50
      delta += spieler.sbe || check_spieler.sbe ? 35 : 0
      const differenz = check_spieler.qttr - spieler.qttr
      // add to invalid list if 
      // a) differenz is too high AND
      // b) the check_spieler has no spv OR the spieler are in the same mannschaft
      if ( differenz > delta && ( ! ( check_spieler.spv.primary || check_spieler.spv.secondary > 0 ) || spieler.mannschaft == mannschaft ) ) {
        check_spieler.invalid.push({
          id: spieler.id,
          mannschaft: spieler.mannschaft,
          position: spieler.position,
          name: spieler.name,
          differenz: differenz,
        }) 
      }
    })
    // check if this spieler is the reason any positionen lower than its own are invalid
    this.spieler
    .filter(spieler => ( 
      spieler.spielklasse == spielklasse && 
      ( spieler.mannschaft == mannschaft && spieler.position > position ) || ( spieler.mannschaft > mannschaft ) ) &&
      spieler.qttr > check_spieler.qttr)
    .forEach(spieler => {
      var delta = spieler.mannschaft == mannschaft ? 35 : 50
      delta += spieler.sbe || check_spieler.sbe ? 35 : 0
      const differenz = spieler.qttr - check_spieler.qttr
      if ( differenz > delta ) {
        var invalid_spieler = spieler.invalid.find(invalid_spieler => { invalid_spieler.id == spieler.id })
        if ( ! invalid_spieler ) {
          invalid_spieler = { id: check_spieler.id }
        }
        invalid_spieler.mannschaft = check_spieler.mannschaft
        invalid_spieler.position = check_spieler.position
        invalid_spieler.name = check_spieler.name
        invalid_spieler.differenz = differenz
        spieler.invalid.push(invalid_spieler)
      }
    })
  }

  _removeSpielerFromInvalidLists(remove_spieler){
    this.spieler
    .filter(spieler => ( (spieler.spielklasse == remove_spieler.spielklasse ) && spieler.invalid.find( invalid_spieler => invalid_spieler.id == remove_spieler.id )))
    .forEach(spieler => {
      spieler.invalid = spieler.invalid.filter(invalid_spieler => invalid_spieler.id !== remove_spieler.id)
    })
  }

  /* 
  * External Manipulate Spieler Array Functions
  */
  addSpieler(spielklasse, mannschaft, position, name, qttr) {
    const id = this.spieler.length > 0 ? Math.max.apply(null, this.spieler.map(spieler => spieler.id)) + 1 : 1
    // add the spieler
    const spieler = {
      id : id,
      name: name,
      spielklasse: spielklasse,
      qttr: qttr,
      farbe: "",
      spv: {
        primary: false,
        secondary: 0
      },
      reserve: false,
      sbe: false,
      kommentar: ""
    }
    this.spieler.push(spieler)
    // insert the new spieler in the correct (spielklasse, mannschaft, position)
    this._insertSpielerInMannschaft(spieler, mannschaft, position)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften, this.spieler)
  }

  reorderSpieler(id, new_mannschaft, new_position) {
    const spieler = this.spieler.find(spieler => spieler.id == id)
    // reorder = remove from old position + insert in new position
    var keep_spv = spieler.mannschaft == new_mannschaft
    this._removeSpielerFromMannschaft(spieler, keep_spv)
    this._insertSpielerInMannschaft(spieler, new_mannschaft, new_position)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften, this.spieler)
  }

  editSpielerSpv(id, spv) {
    const spieler = this.spieler.find(spieler => spieler.id == id)
    // set the primary Spv for this spieler and the secondary for all with higher positionen in the same mannschaft
    this._setSpvForSpieler(spieler, spv)
    // check if any invalid ttrdifferenzen can now be removed
    this._checkTtrDifferenzenForPosition(spieler.spielklasse, spieler.mannschaft, spieler.position)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften, this.spieler)
  }

  deleteSpieler(id) {
    this.spieler = this.spieler.filter(spieler => spieler.id !== id )
  }

  /* 
  * Internal Manipulate Spieler Array Functions
  */
  _removeSpielerFromMannschaft(remove_spieler, keep_spv=false){
    // Save current spieler position
    const old_mannschaft = remove_spieler.mannschaft
    const old_position = remove_spieler.position
    // Save the next_spieler for which we have to recompute the ttrdifferenz
    const next_spieler = this._getNextSpieler(remove_spieler)
    // handle sperrvermerk before the spieler gets updated
    if ( remove_spieler.spv.primary ) {
      if (keep_spv ) {
      // Remove spv only from all spieler in the same mannschaft with higher positionen
      this._updateSecondarySpvHigherThanPosition(remove_spieler.spielklasse, remove_spieler.mannschaft, remove_spieler.position, false)
      } else {
        // Remove spv from this spieler and all spieler in the same mannschaft with higher positionen
        this._setSpvForSpieler(remove_spieler, false)
      }
    }
    // Reset our secondary spv counter when we leave a mannschaft
    remove_spieler.spv.secondary = 0
    // Give the spieler the position 0.0
    remove_spieler.mannschaft = 0
    remove_spieler.position = 0
    // decrease all positionen from mannschaft greater than position by one
    this.spieler
    .filter( spieler => ( spieler.spielklasse == remove_spieler.spielklasse && spieler.mannschaft == old_mannschaft && spieler.position >= old_position ) )
    .forEach( spieler => { spieler.position-- } )
    // reorder this.spieler
    this.spieler = this.spieler.sort((a,b) => this._compareSpielerPositionen(a, b))
    // recompute ttrdifferenz for the new position
    if (next_spieler) {
      this._recomputeTtrDifferenzForSpieler(next_spieler)
    }
    // remove this spieler from all invalid lists of other spieler
    this._removeSpielerFromInvalidLists(remove_spieler)
  }

  _insertSpielerInMannschaft(insert_spieler, mannschaft, position) {
    // increase all positionen from mannschaft greater or equal than position by one
    this.spieler
    .filter( spieler => ( spieler.spielklasse == insert_spieler.spielklasse && spieler.mannschaft == mannschaft && spieler.position >= position ) )
    .forEach( spieler => { 
      spieler.position++
      // also check if any of the positionen has a sperrvermerk and increase our secondary if so
      if (spieler.spv.primary) { insert_spieler.spv.secondary++ }
    } )
    // give the spieler the new mannschaft and position
    insert_spieler.spielklasse = insert_spieler.spielklasse
    insert_spieler.mannschaft = mannschaft
    insert_spieler.position = position
    // reorder this.spieler
    this.spieler = this.spieler.sort((a,b) => this._compareSpielerPositionen(a, b))
    // Update spv for all spieler in the same mannschaft with higher positionen
    if ( insert_spieler.spv.primary ) {
      this._updateSecondarySpvHigherThanPosition(insert_spieler.spielklasse, insert_spieler.mannschaft, insert_spieler.position, insert_spieler.spv.primary)
    }
    // recompute ttrdifferenz for the new position
    this._recomputeTtrDifferenzForSpieler(insert_spieler)
    // check if any ttrdifferenzen are now invalid
    this._checkTtrDifferenzenForPosition(insert_spieler.spielklasse, insert_spieler.mannschaft, insert_spieler.position)
  }

  _compareSpielerPositionen(spieler1, spieler2) {
    const spielklasse_compare = spieler1.spielklasse.localeCompare(spieler2.spielklasse)
    return (spielklasse_compare != 0) ? spielklasse_compare : (spieler1.mannschaft * 1000 + spieler1.position) - ( spieler2.mannschaft * 1000 + spieler2.position )
  }
  
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

  _getPreviousSpieler(spieler){
    const prev_index = this.spieler.indexOf(spieler) - 1
    return ( (prev_index > -1) && (this.spieler[prev_index].spielklasse == spieler.spielklasse) ) ? this.spieler[prev_index] : null
  }

  _getNextSpieler(spieler){
    const next_index = this.spieler.indexOf(spieler) + 1
    return ( (next_index < this.spieler.length) && (this.spieler[next_index].spielklasse == spieler.spielklasse) ) ? this.spieler[next_index] : null
  }

  _setSpvForSpieler(spieler, spv) {
    // Set the SPV of this Spieler
    spieler.spv.primary = spv
    // Check if other Spieler in the same Mannschaft and with higher Positionen also need an SPV now
    this._updateSecondarySpvHigherThanPosition(spieler.spielklasse, spieler.mannschaft, spieler.position, spv)
  }

  _updateSecondarySpvHigherThanPosition(spielklasse, mannschaft, position, spv) {
    this.spieler
    .filter(spieler => spieler.spielklasse == spielklasse && spieler.mannschaft == mannschaft && spieler.position < position )
    .forEach(spieler => {
        if (spv) { spieler.spv.secondary++ }
        else { spieler.spv.secondary-- }
    })
  }

  /*
  * External Manipulate Mannschaften Array Functions
  */
  addMannschaft(spielklasse){
    const mannschaft = { 
      spielklasse: spielklasse,
      nummer: this.mannschaften.length > 0 ? this.mannschaften[this.mannschaften.length - 1].nummer + 1 : 1,
      liga: "",
      sollstaerke: 6,
      spieltag: "",
      uhrzeit: "",
      spielwoche: ""
    }

    this.mannschaften.push(mannschaft);
  }

  deleteMannschaft(spielklasse, nummer){
    this.mannschaften = this.mannschaften.filter(mannschaft => ( mannschaft.spielklasse !== spielklasse && mannschaft.nummer !== nummer))
  }

  bindMannschaftenChanged(callback) {
    this.onMannschaftenChanged = callback
  }

  // Map through all todos, and replace the text of the todo with the specified id
  /*
  editTodo(id, updatedText) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { id: todo.id, text: updatedText, complete: todo.complete } : todo
    )
  }
  */

  // Flip the complete boolean on the specified todo
  /*
  toggleTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo
    )
  }
  */
}