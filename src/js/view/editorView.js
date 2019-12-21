class EditorView {
  constructor() {
    $('#editor').append(`
      <div class="container editor-container">
        <div class="row">
          <div class="col-8">
            <div id="mannschafts-container" class="container">
            </div>
            <div class="container">
              <div class="row mannschafts-row">
                <div class="card mannschaft">
                  <button class="btn btn-light text-muted">
                    <i class="fa fa-plus"></i>
                    Mannschaft hinzufügen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    this.mannschaftsContainer = $('#mannschafts-container')
  }

  displayMannschaften(mannschaften, spieler) {
    // Delete all nodes execpt the "Mannschaft hinzufügen" button
    while (this.mannschaftsContainer.children().length > 0 ) {
      this.mannschaftsContainer.children().first().remove()
    }

    // Create Mannschafts rows for each Mannschaft in state
    mannschaften.slice().reverse().forEach(mannschaft => {
      const id = `${mannschaft.spielklasse}-${mannschaft.nummer}`
      const romanNumber = this._getRomanNumberOfInteger(`${mannschaft.nummer}`)
      const displayMannschaftsName = mannschaft.spielklasse + ( romanNumber === "I" ? "" : " " + romanNumber)
      // Add the row for the Mannschaft
      this.mannschaftsContainer.prepend(`
        <div class="row mannschafts-row">
          <div id="mannschaft-${id}" class="card mannschaft">
            <div class="card-header mannschaft-header">
              <div class="d-flex justify-content-between">
                <div class="p-2">
                  <a href="#" class="text-dark"><h5 id="mannschaft-${id}-name">${displayMannschaftsName}</h5></a>
                </div>
                <div class="p-2 text-muted">
                  <small id="mannschaft-${id}-liga">${mannschaft.liga}</small>
                </div>
                <div class="p-2 text-muted">
                  <small id="mannschaft-${id}-spieltag">${mannschaft.spieltag}, ${mannschaft.uhrzeit} Uhr</small>
                </div>
                <div class="p-2 text-muted">
                  <small id="mannschaft-${id}-spielwoche">${mannschaft.spielwoche}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      `)

      // Add all Spieler to the Mannschaft
      this.spielerliste = $(`<ul id="mannschaft-${id}-spielerliste" class="list-group list-group-flush connectedSortable spielerliste"></ul>`)
      $('#mannschaft-' + id).append(this.spielerliste)
      this.spielerlistemodel = spieler.filter(spieler => spieler.mannschaft === mannschaft.nummer).sort((a,b) => { return a.position - b.position })
      this.spielerlistemodel.forEach( spieler => {
        // spieler.ttrdifferenz may be false for the very first Spieler. Do not display it
        const ttrdifferenz = spieler.ttrdifferenz !== false ? spieler.ttrdifferenz : "";
        const ttrdifferenzVorzeichen = ttrdifferenz > 0 ? "+" : ""
        this.spielerliste.append(`
          <li id="spieler-${spieler.id}" class="list-group-item spieler">
            <div class="d-flex">
              <div id="spieler-${spieler.id}-position" class="p-2 text-muted">${mannschaft.nummer}.${spieler.position}</div>
              <div id="spieler-${spieler.id}-name" class="p-2 flex-grow-1 link">${spieler.name}</div>
              <div id="spieler-${spieler.id}-spv" class="p-2 spv"></div>
              <div id="spieler-${spieler.id}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>
              <div id="spieler-${spieler.id}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>
            </div>
          </li>
        `)
        $(`#spieler-${spieler.id}-ttrdifferenz`).addClass(ttrdifferenz > 0 ? "text-success" : ttrdifferenz < 0 ? "text-danger" : "")
      })

      // New spieler button in seperate list because we dont want it to be draggable
      $('#mannschaft-' + id).append(`
        <ul class="list-group list-group-flush">
          <li id="mannschaft-${id}-new-spieler" class="list-group-item spieler new-spieler-form">
            <div class="d-flex">
              <div id="mannschaft-${id}-new-position" class="p-2 text-muted invisible">${mannschaft.nummer}.${this.spielerlistemodel.length + 1}</div>
              <div id="mannschaft-${id}-new-name" class="p-2 flex-grow-1"></div>
              <div id="mannschaft-${id}-new-qttr" class="p-2 ttr-wert text-muted"></div>
            </div>
          </li>
        </ul>
      `)
      const addSpielerButton = $(`<button id="mannschaft-${id}-addspielerbtn" class="btn btn-light text-muted"><i class="fa fa-plus"></i> Spieler hinzufügen</button>`)
      const newNameInput = $(`<input id="mannschaft-${id}-new-name-input" type="text" class="form-control display-none" placeholder="Nachname, Vorname"></input>`)
      const newQttrInput = $(`<input id="mannschaft-${id}-new-qttr-input" type="number" class="form-control display-none" placeholder="TTR" min="0" max="3000"></input>`)
      $(`#mannschaft-${id}-new-name`).append(addSpielerButton)
      $(`#mannschaft-${id}-new-name`).append(newNameInput)
      $(`#mannschaft-${id}-new-qttr`).append(newQttrInput)

      // add eventlistener to display new spieler form
      addSpielerButton.hover(
        () => { $(`#mannschaft-${id}-new-position`).removeClass("invisible") },
        () => { if ( ! addSpielerButton.hasClass('display-none') ) { $(`#mannschaft-${id}-new-position`).addClass("invisible") } }
      )
      
      // display input form for Name and QTTR instead of button
      addSpielerButton.click( () => {
        addSpielerButton.addClass("display-none")
        newNameInput.removeClass("display-none")
        newNameInput.removeClass("is-invalid")
        newQttrInput.removeClass("display-none")
        newQttrInput.removeClass("is-invalid")
        $(`#mannschaft-${id}-new-position`).removeClass("invisible")
        newNameInput.focus()
      })

      // if both inputs are empty -> discard
      newNameInput.focusout( () => {
        if (newNameInput.val() === "" && newQttrInput.val() === "") {
          addSpielerButton.removeClass("display-none")
          newNameInput.addClass("display-none")
          newQttrInput.addClass("display-none")
          $(`#mannschaft-${id}-new-position`).addClass("invisible")
        }
      })
      newQttrInput.focusout( () => {
        if (newNameInput.val() === "" && newQttrInput.val() === "") {
          addSpielerButton.removeClass("display-none")
          newNameInput.addClass("display-none")
          newQttrInput.addClass("display-none")
          $(`#mannschaft-${id}-new-position`).addClass("invisible")
        }
      })

    })

    // Activate sorting
    $( ".connectedSortable" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
    
  }

  bindAddSpieler(handler) {
    $(".new-spieler-form input").on("keyup", (event) => {
      event.preventDefault()

      // Only react on <Enter>
      if (event.keyCode === 13) {
        // Find out which input has been hit enter in
        var input_type = ""
        var newNameInput = ""
        var newQttrInput = ""
        if (event.target.id.includes("new-name")){
          input_type = "name"
          newNameInput = $("#" + event.target.id)
          newQttrInput = $("#" + event.target.id.replace("name","qttr"))
        } else if (event.target.id.includes("new-qttr")){
          input_type = "qttr"
          newNameInput = $("#" + event.target.id.replace("qttr","name"))
          newQttrInput = $("#" + event.target.id)
        }
        var addSpielerButton = $("#" + event.target.id.replace("new-" + input_type + "-input","addspielerbtn"))
        var newPositionLabel = $("#" + event.target.id.replace("new-" + input_type + "-input","new-position"))

        // Get the inputs
        var newname = newNameInput.val()
        var newqttr = parseInt(newQttrInput.val(), 10)

        // Test if inputs are valid
        if ( newname === "" ) {
          newNameInput.addClass("is-invalid")
        }
        if (newqttr !== parseInt(newqttr, 10) || newqttr <= 0 ) {
          newQttrInput.addClass("is-invalid")
        }

        // Add the Spieler to the model
        if ( newname !== "" && newqttr === parseInt(newqttr, 10) && newqttr > 0 ) {
          addSpielerButton.removeClass("display-none")
          newNameInput.addClass("display-none")
          newNameInput.val("")
          newNameInput.removeClass("is-invalid")
          newQttrInput.addClass("display-none")
          newQttrInput.val("")
          newQttrInput.removeClass("is-invalid")
          newPositionLabel.addClass("invisible")

          const mannschaft = parseInt(newPositionLabel.text().trim().split('.')[0], 10)
          const position = parseInt(newPositionLabel.text().trim().split('.')[1], 10)
          handler(mannschaft, position, newname, newqttr)
        }
      }
    })
  }

  handleNewSpielerFormFocusOut(addSpielerButton, newNameInput, newQttrInput, id) {
    const newname = newNameInput.val()
    const newqttr = newQttrInput.val()
    if ( newname === "" && newqttr === "") {
      // if both inputs are empty -> discard
      addSpielerButton.removeClass("display-none")
      newNameInput.addClass("display-none")
      newQttrInput.addClass("display-none")
      $(`#mannschaft-${id}-new-position`).addClass("invisible")
    } else if ( newname !== "" && newqttr !== "" ) {
      // if both inputs are filled -> add spieler
    }
  }

  _getRomanNumberOfInteger(i){
    i = i.replace('15', 'XV');
    i = i.replace('14', 'XIV');
    i = i.replace('13', 'XIII');
    i = i.replace('12', 'XII');
    i = i.replace('11', 'XI');
    i = i.replace('10', 'X');
    i = i.replace('9', 'IX');
    i = i.replace('8', 'VIII');
    i = i.replace('7', 'VII');
    i = i.replace('6', 'VI');
    i = i.replace('5', 'V');
    i = i.replace('4', 'IV');
    i = i.replace('3', 'III');
    i = i.replace('2', 'II');
    i = i.replace('1', 'I');
    return i;
  }
}


/*

<div class="container mannschafts-container">
          <div class="row">
            <div class="col-8">
              <div class="container">
                <div class="row mannschafts-row">
                  <div class="card mannschaft">
                    <div class="card-header mannschaft-header">
                      <div class="d-flex justify-content-between">
                        <div class="p-2">
                          <h5><a onclick="showHerrenIDetails()" href="#" class="text-dark">Herren I</a></h5>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Verbandsliga</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Samstag, 17:30 Uhr</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>A</small>
                        </div>
                      </div>
                    </div>
                    <ul class="list-group list-group-flush connectedSortable">
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.1
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 1
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1900
                          </div>
                          <div class="p-2 ttr-difference text-success">
        
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.2
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 2
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1840
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -60
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.3
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 3
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1820
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -20
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler invalid spieler-invalid">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.4
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 4
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1860
                          </div>
                          <div class="p-2 ttr-difference text-danger" data-toggle="tooltip" data-placement="right"
                        data-html="true" title="<b>Ungültige Reihenfolge</b><br/>Spieler 4 hat 40 TTR-Punkte mehr als Spieler 3">
                            +40
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.5
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 5
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1820
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -40
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.6
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 6
                            <span class="spieler-extra-icon text-warning">
                              <i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="right" title="Spieler 6 hatte in der letzten Halbserie weniger als 6 Einsätze"></i>
                            </span>
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1810
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="card-footer bg-transparent mannschaft-footer">
                      <button class="btn btn-light text-muted">
                        <i class="fa fa-plus"></i>
                        Spieler hinzufügen
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row mannschafts-row">
                  <div class="card mannschaft invalid mannschaft-invalid">
                    <div class="card-header mannschaft-header" data-toggle="tooltip" data-placement="left" data-html="true"
                      title="<b>Fehlende Sollstärke</b><br/>Herren II hat nur 5 Stammspieler">
                      <div class="d-flex justify-content-between">
                        <div class="p-2">
                          <h5>Herren II</h5>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Landesliga</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Samstag, 17:30 Uhr</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>B</small>
                        </div>
                      </div>
                    </div>
                    <ul class="list-group list-group-flush connectedSortable">
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.1
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 7
                          </div>
                          <div class="p-2 spv">
                            <span class="badge badge-danger spv-badge">SPV</span>
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1910
                          </div>
                          <div class="p-2 ttr-difference text-danger">
                            +100
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.2
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 8
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1750
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.3
                          </div>
                          <div class="p-2 flex-grow-1">
                            <a onclick="showSpieler9Details()">Spieler 9 <i class="fa fa-comment-o text-muted spieler-extra-icon" data-toggle="tooltip" data-placement="right"
                              data-html="true" title="Kommentar"></i></a>
                            
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1740
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.4
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 10
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1730
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.5
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 11
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1720
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.6
                          </div>
                          <div class="p-2 text-muted flex-grow-1">
                            Spieler 12
                            <span class="badge badge-secondary spieler-extra-icon" data-toggle="tooltip" data-placement="right"
                              data-html="true" title="Spieler 12 hatte in der letzten Halbserie keinen Einsatz">RES</span>
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1710
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="card-footer bg-transparent mannschaft-footer">
                      <button class="btn btn-light text-muted">
                        <i class="fa fa-plus"></i>
                        Spieler hinzufügen
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row mannschafts-row">
                  <div class="card mannschaft">
                    <div class="card-header mannschaft-header">
                      <div class="d-flex justify-content-between">
                        <div class="p-2">
                          <h5>Herren III</h5>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Bezirksklasse</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Freitag, 20:00 Uhr</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>A</small>
                        </div>
                      </div>
                    </div>
                    <ul class="list-group list-group-flush connectedSortable">
                      <li class="list-group-item spieler invalid spieler-invalid" data-toggle="tooltip" data-placement="left"
                        data-html="true" title="<b>Ungültige Reihenfolge</b><br/>Spieler 13 hat 70 TTR-Punkte mehr als Spieler 12">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.1
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 13
                          </div>
                          <div class="p-2 spv">
                            <span class="badge badge-light spv-badge">SPV</span>
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1780
                          </div>
                          <div class="p-2 ttr-difference text-danger">
                            +70
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.2
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 14
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1650
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -130
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.3
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 15
                            <span class="badge badge-dark spieler-extra-icon" data-toggle="tooltip" data-placement="right"
                              data-html="true" title="Jugend Ersatzspieler">JES</span>
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1640
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler spieler-farbe-warning">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.4
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 16
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1630
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.5
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 17
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1620
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.6
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 18
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1610
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="card-footer bg-transparent mannschaft-footer">
                      <button class="btn btn-light text-muted">
                        <i class="fa fa-plus"></i>
                        Spieler hinzufügen
                      </button>
                    </div>
                  </div>
                </div>

                <div class="row mannschafts-row">
                  <div class="card mannschaft">
                    <button class="btn btn-light text-muted">
                      <i class="fa fa-plus"></i>
                      Mannschaft hinzufügen
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

*/