class MannschaftView {
  constructor(mannschaftsContainer, mannschaft, mannschaftsspieler, letzte_mannschaft) {
    this.mannschaft = mannschaft
    const id = `${(mannschaft.spielklasse).replace(" ", "_")}-${mannschaft.nummer}`
    // Add the row for the Mannschaft
    this.html = $(`
      <div class="row mannschafts-row">
        <div id="mannschaft-${id}" class="card mannschaft">
          <div class="card-header mannschaft-header link">
            <div class="d-flex justify-content-between">
              <div class="p-2">
                <span class="text-dark"><h5 id="mannschaft-${id}-name">${mannschaft.name}</h5></span>
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
              <div id="mannschaft-${id}-invalid-icon" class="p-2 mannschaft-invalid-icon text-danger">
                <span><i class="fa fa-exclamation-triangle"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    mannschaftsContainer.append(this.html)
    const mannschafts_div = $("#mannschaft-" + id)
    this.mannschafts_header = mannschafts_div.find(".mannschaft-header")

    // Add all Spieler to the Mannschaft
    this.spielerListeContainer = $(`<ul id="mannschaft-${id}-spielerliste" class="list-group list-group-flush connected-sortable-spieler spielerliste"></ul>`)
    mannschafts_div.append(this.spielerListeContainer)
    this.spielerViews = []
    mannschaftsspieler.forEach( spieler => {
      this.spielerViews.push( new SpielerView(this.spielerListeContainer, spieler) )
    })

    // Spieler Hinzufügen Form
    // New spieler button in seperate list because we dont want it to be draggable
    mannschafts_div.append(`
      <ul class="list-group list-group-flush add-spieler-button-container">
        <li id="mannschaft-${id}-new-spieler" class="list-group-item spieler new-spieler-form">
          <div class="d-flex">
            <div id="mannschaft-${id}-new-position" class="p-2 text-muted invisible">${mannschaft.nummer}.${mannschaftsspieler.length + 1}</div>
            <div id="mannschaft-${id}-new-name" class="p-2 flex-grow-1"></div>
            <div id="mannschaft-${id}-new-qttr" class="p-2 ttr-wert text-muted"></div>
          </div>
        </li>
      </ul>
    `)
    this.addSpielerButton = $(`<button id="mannschaft-${id}-addspielerbtn" class="btn btn-light text-muted"><i class="fa fa-plus"></i> Spieler hinzufügen</button>`)
    this.newNameInput = $(`<input id="mannschaft-${id}-new-name-input" type="text" class="form-control display-none" placeholder="Nachname, Vorname"></input>`)
    this.newQttrInput = $(`<input id="mannschaft-${id}-new-qttr-input" type="number" class="form-control display-none" placeholder="TTR" min="0" max="3000"></input>`)
    this.newPositionLabel = $(`#mannschaft-${id}-new-position`)
    $(`#mannschaft-${id}-new-name`).append(this.addSpielerButton)
    $(`#mannschaft-${id}-new-name`).append(this.newNameInput)
    $(`#mannschaft-${id}-new-qttr`).append(this.newQttrInput)

    // add invalid class, invalid-icon, tooltip
    if ( mannschaft.invalid ) {
      mannschafts_div.addClass("invalid")
      mannschafts_div.addClass("mannschaft-invalid")
      const mannschaft_invalid_icon = $(`#mannschaft-${id}-invalid-icon`)
      mannschaft_invalid_icon.attr("data-toggle","tooltip")
      mannschaft_invalid_icon.attr("data-placement","right")
      mannschaft_invalid_icon.attr("data-html","true")
      const stammspieler_str = mannschaft.nummer !== letzte_mannschaft ? "Stammspieler": "Spieler"
      var tooltip_title = `<h6>Fehlende Sollstärke</h6>Mind. ${mannschaft.sollstaerke} ${stammspieler_str} benötigt`
      mannschaft_invalid_icon.attr("title",tooltip_title)
    }

    // add eventlistener to display new spieler form
    this.addSpielerButton.hover(
      () => { this.newPositionLabel.removeClass("invisible") },
      () => { if ( ! this.addSpielerButton.hasClass('display-none') ) { this.newPositionLabel.addClass("invisible") } }
    )

    // display input form for Name and QTTR instead of button
    this.addSpielerButton.click( () => { this._displayAddSpielerForm() } )
    
    // if both inputs are empty -> discard
    this.newNameInput.focusout( () => { this._hideEmptyAddSpielerForm() } )
    this.newQttrInput.focusout( () => { this._hideEmptyAddSpielerForm() } )

  }

  /* MANNSCHAFT BINDINGS */

  bindClickOnMannschaft(handler) {
    this.mannschafts_header.click( (event) => { 
      handler(this.mannschaft.id)
    })
  }

  /* SPIELER BINDINGS */

  bindAddSpieler(handler) {
    this.newNameInput.on("keyup", (event) => { this._addSpielerKeyUpHandler(event, handler); } )
    this.newQttrInput.on("keyup", (event) => { this._addSpielerKeyUpHandler(event, handler); } )
  }

  bindClickOnSpieler(handler) {
    this.spielerViews.forEach(spieler => { spieler.bindClickOnSpieler(handler)})
  }

  bindToggleSpvOnSpieler(handler) {
    this.spielerViews.forEach(spieler => { spieler.bindToggleSpvOnSpieler(handler)})
  }

  delete() {
    this.html.remove()
  }

  _addSpielerKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we add a new spieler
    if (event.keyCode === 13) {
      this._addSpieler(handler)
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this._hideAddSpielerForm()
    }
  }

  _addSpieler(handler){
    // Get the inputs
    var newname = this.newNameInput.val()
    var newqttr = parseInt(this.newQttrInput.val(), 10)
    // Test if inputs are valid
    if ( newname === "" ) { this.newNameInput.addClass("is-invalid") }
    if ( newqttr !== parseInt(newqttr, 10) || newqttr < 0 ) { this.newQttrInput.addClass("is-invalid") }
    // Add the Spieler to the model in it is valid
    if ( newname !== "" && newqttr === parseInt(newqttr, 10) && newqttr >= 0 ) {
      const spielklasse = this.newNameInput.attr("id").split("-")[1]
      const mannschaft = parseInt(this.newPositionLabel.text().trim().split('.')[0], 10)
      const position = parseInt(this.newPositionLabel.text().trim().split('.')[1], 10)
      this._hideAddSpielerForm()
      handler(spielklasse, mannschaft, position, newname, newqttr)
    }
  }

  _displayAddSpielerForm() {
    this.addSpielerButton.addClass("display-none")
    this.newNameInput.removeClass("display-none")
    this.newNameInput.removeClass("is-invalid")
    this.newQttrInput.removeClass("display-none")
    this.newQttrInput.removeClass("is-invalid")
    this.newPositionLabel.removeClass("invisible")
    this.newNameInput.focus()
  }

  _hideAddSpielerForm() {
    this.addSpielerButton.removeClass("display-none")
    this.newNameInput.addClass("display-none")
    this.newNameInput.val("")
    this.newQttrInput.addClass("display-none")
    this.newQttrInput.val("")
    this.newPositionLabel.addClass("invisible")
  }

  _hideEmptyAddSpielerForm() {
    if (this.newNameInput.val() === "" && this.newQttrInput.val() === "") {
      this._hideAddSpielerForm()
    }
  }

}