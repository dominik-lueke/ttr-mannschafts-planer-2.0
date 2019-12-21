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
        mannschaft: 1,
        position: 1,
        qttr: 1900,
        ttrdifferenz: false,
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
        mannschaft: 1,
        position: 2,
        qttr: 1890,
        ttrdifferenz: 10,
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
        mannschaft: 1,
        position: 3,
        qttr: 1880,
        ttrdifferenz: 10,
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
        mannschaft: 1,
        position: 4,
        qttr: 1870,
        ttrdifferenz: 10,
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
        mannschaft: 1,
        position: 5,
        qttr: 1860,
        ttrdifferenz: 10,
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
        mannschaft: 1,
        position: 6,
        qttr: 1850,
        ttrdifferenz: 10,
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

  addSpieler(mannschaft, position, name, qttr) {

    // compute the new ttr differenz by searching for the smallest ttr wert of all players before this one
    var smallest_qttr = 3000
    this.spieler.filter(spieler => (spieler.mannschaft <= mannschaft && spieler.position < position)).forEach(spieler => {
      smallest_qttr = smallest_qttr < spieler.qttr ? smallest_qttr: spieler.qttr
    })
    const ttrdifferenz = smallest_qttr - qttr

    // add the spieler
    const spieler = {
      id : this.spieler.length > 0 ? this.spieler[this.spieler.length - 1].id + 1 : 1,
      name: name,
      mannschaft, mannschaft,
      position, position,
      qttr: qttr,
      ttrdifferenz: ttrdifferenz,
      farbe: "",
      spv: false,
      reserve: false,
      sbe: false,
      kommentar: ""
    }
    this.spieler.push(spieler)

    // update the ttr differenz for players behind this one if necessary
    this.spieler.filter(spieler => (spieler.mannschaft >= mannschaft && spieler.position > position)).forEach(spieler => {
      if (spieler.ttrdifferenz > (spieler.qttr - qttr)) {
        spieler.ttrdifferenz = spieler.qttr - qttr
      }
    })

    this.onMannschaftenChanged(this.mannschaften, this.spieler)
  }

  deleteSpieler(id) {
    this.spieler = this.spieler.filter(spieler => spieler.id !== id )
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