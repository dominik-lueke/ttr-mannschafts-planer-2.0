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
        sbe: false,
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
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
        spv: false,
        reserve: false,
        sbe: false,
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
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
        sbe: false,
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
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
        sbe: false,
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
      },
      {
        id: 5,
        name: "Nachname, Vorname5",
        spielklasse: "Herren",
        mannschaft: 1,
        position: 5,
        qttr: 1860,
        ttrdifferenz: -10,
        farbe: "",
        spv: false,
        reserve: false,
        sbe: false,
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
      },
      {
        id: 6,
        name: "Nachname, Vorname6",
        spielklasse: "Herren",
        mannschaft: 1,
        position: 6,
        qttr: 1850,
        ttrdifferenz: -10,
        farbe: "",
        spv: false,
        reserve: false,
        sbe: false,
        kommentar: "",
        invalid: false,
        invalidKommentar: ""
      }
    ]
  }

  addSpieler(spielklasse, mannschaft, position, name, qttr) {
    const id = this.spieler.length > 0 ? this.spieler[this.spieler.length - 1].id + 1 : 1
    // add the spieler
    const spieler = {
      id : id,
      name: name,
      qttr: qttr,
      farbe: "",
      spv: false,
      reserve: false,
      sbe: false,
      kommentar: ""
    }
    this.spieler.push(spieler)
    // insert the new spieler in the correct (spielklasse, mannschaft, position)
    this._insertSpielerInMannschaft(id, spielklasse, mannschaft, position)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften, this.spieler)
  }

  reorderSpieler(id, old_mannschaft, old_position, new_mannschaft, new_position, spielklasse) {
    // reorder = remove from old position + insert in new position
    this._removePositionFromMannschaft(spielklasse, old_mannschaft, old_position)
    this._insertSpielerInMannschaft(id, spielklasse, new_mannschaft, new_position)
    // trigger view update
    this.onMannschaftenChanged(this.mannschaften, this.spieler)
  }

  deleteSpieler(id) {
    this.spieler = this.spieler.filter(spieler => spieler.id !== id )
  }

  _removePositionFromMannschaft(spielklasse, mannschaft, position){
    // Give the position the values 0.0
    this.spieler
    .filter(spieler => ( spieler.spielklasse == spielklasse && spieler.mannschaft == mannschaft && spieler.position == position) )
    .forEach(spieler => {
      spieler.mannschaft = 0
      spieler.position = 0
    })
    // decrease all positionen from mannschaft greater than position by one
    this.spieler
    .filter( spieler => ( spieler.spielklasse == spielklasse && spieler.mannschaft == mannschaft && spieler.position > position ) )
    .forEach( spieler => { spieler.position-- } )
    // reorder this.spieler
    this.spieler = this.spieler.sort((a,b) => this._compareSpielerPositionen(a, b))
    // recompute ttrdifferenz for the new position
    this._recomputeTtrDifferenzForPosition(spielklasse, mannschaft, position)
  }

  _insertSpielerInMannschaft(id, spielklasse, mannschaft, position) {
    // increase all positionen from mannschaft greater or equal than position by one
    this.spieler
    .filter( spieler => ( spieler.spielklasse == spielklasse && spieler.mannschaft == mannschaft && spieler.position >= position ) )
    .forEach( spieler => { spieler.position++} )
    // give the Spieler with id the new mannschaft and position
    this.spieler
    .filter(spieler => ( spieler.id == id) )
    .forEach( spieler => {
      spieler.spielklasse = spielklasse
      spieler.mannschaft = mannschaft
      spieler.position = position
    })
    // reorder this.spieler
    this.spieler = this.spieler.sort((a,b) => this._compareSpielerPositionen(a, b))
    // recompute ttrdifferenz for the new position
    this._recomputeTtrDifferenzForPosition(spielklasse, mannschaft, position)
  }

  _compareSpielerPositionen(spieler1, spieler2) {
    const spielklasse_compare = spieler1.spielklasse.localeCompare(spieler2.spielklasse)
    return (spielklasse_compare != 0) ? spielklasse_compare : (spieler1.mannschaft * 1000 + spieler1.position) - ( spieler2.mannschaft * 1000 + spieler2.position )
  }
  
  _recomputeTtrDifferenzForPosition(spielklasse, mannschaft, position) {
    // update the ttr differenz for the spieler with given and the one at the position behind
    this.spieler
    .filter(spieler => ( spieler.spielklasse == spielklasse && spieler.mannschaft == mannschaft && spieler.position == position) )
    .forEach(spieler => {
      // update this spieler
      const previousSpieler = this._getPreviousSpieler(spieler)
      const prev_ttr = ( previousSpieler !== null ) ? previousSpieler.qttr : -1
      spieler.ttrdifferenz = (prev_ttr > -1) ? spieler.qttr - prev_ttr: 0
      // update next spieler
      const nextSpieler = this._getNextSpieler(spieler)
      if ( nextSpieler !== null ) {
        nextSpieler.ttrdifferenz = nextSpieler.qttr - spieler.qttr
      }
    })
  }

  _getPreviousSpieler(spieler){
    const prev_index = this.spieler.indexOf(spieler) - 1
    return ( (prev_index > -1) && (this.spieler[prev_index].spielklasse == spieler.spielklasse) ) ? this.spieler[prev_index] : null
  }

  _getNextSpieler(spieler){
    const next_index = this.spieler.indexOf(spieler) + 1
    return ( (next_index < this.spieler.length) && (this.spieler[next_index].spielklasse == spieler.spielklasse) ) ? this.spieler[next_index] : null
  }


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