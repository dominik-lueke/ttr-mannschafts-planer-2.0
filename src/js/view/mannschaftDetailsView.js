class MannschaftDetailsView {
  constructor(container) {
    this.mannschaft = {}
    // HEADER
    this.header = `
      <div class="card-header bg-white">
        <div class="d-flex">
          <div class="p-2 text-muted">
            <i class="fa fa-2x fa-users"></i>
          </div>
          <div class="p-2 flex-grow-1">
            <h4 id="mannschaft-details-name-header"></h4>
          </div>
          <div class="pl-2 pt-2 pr-0">
            <button id="mannschaft-details-close-button" type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          </div>
        </div>
    `
    // BODY
    this.body = `
      <div class="card-body">
        <h6 class="text-muted">Liga <small>(Mannschaftsstärke)</small></h6>
        <div class="form-row mb-4">
          <div class="col-sm-9">
            <input id="mannschaft-details-liga-input" type="text" class="form-control form-control-sm" value="" >
          </div>
          <div class="col-sm-3">
            <select id="mannschaft-details-sollstaerke-select" class="form-control form-control-sm">
              <option value="6">6er</option>
              <option value="4">4er</option>
            </select>
          </div>
        </div>
        <h6 class="text-muted">Spieltag <small>(Spielwoche)</small></h6>
        <div class="form-row mb-4">
          <div class="col-sm-6">
            <select id="mannschaft-details-spieltag-select" class="form-control form-control-sm">
              <option value="Montag">Montag</option>
              <option value="Dienstag">Dienstag</option>
              <option value="Mittwoch">Mittwoch</option>
              <option value="Donnerstag">Donnerstag</option>
              <option value="Freitag">Freitag</option>
              <option value="Samstag">Samstag</option>
              <option value="Sonntag">Sonntag</option>
            </select>
          </div>
          <div class="col-sm-4">
            <input id="mannschaft-details-uhrzeit-input" type="text" class="form-control form-control-sm" placeholder="17:30">
          </div>
          <div class="col-sm-2">
          <select id="mannschaft-details-spielwoche-select" class="form-control form-control-sm">
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          </div>
        </div>
      </div>
    `
    // FOOTER
    this.footer = `
      <div class="card-footer bg-white">
        <div class="d-flex">
          <button id="mannschaft-details-delete-button" class="flex-fill btn btn-outline-danger">
            <small>
              <i class="fa fa-trash"></i>
              Mannschaft löschen
            </small>
          </button>
          <button id="mannschaft-details-delete-keep-spieler-button" class="flex-fill btn btn-outline-success display-none">
            <small>
              <i class="fa fa-check"></i>
              Spieler behalten
            </small>
          </button>
          <button id="mannschaft-details-delete-remove-spieler-button" class="flex-fill btn btn-outline-danger display-none">
            <small>
              <i class="fa fa-trash"></i>
              Spieler auch löschen
            </small>
          </button>
        </div>
      </div>
    `
    this.html = `
      <div id="mannschaft-details-view" class="card bg-white display-none">
        ${this.header}
        ${this.body}
        ${this.footer}
      </div>
    `
    container.append(this.html)
    // cache jq elements
    this.card_div = $(`#mannschaft-details-view`)
    this.name_header = $("#mannschaft-details-name-header")
    this.close_button = $("#mannschaft-details-close-button")
    this.liga_input = $("#mannschaft-details-liga-input")
    this.sollstaerke_select = $("#mannschaft-details-sollstaerke-select")
    this.spieltag_select = $("#mannschaft-details-spieltag-select")
    this.uhrzeit_input = $("#mannschaft-details-uhrzeit-input")
    this.spielwoche_select = $("#mannschaft-details-spielwoche-select")
    this.delete_button = $("#mannschaft-details-delete-button")
    this.delete_keep_spieler_button = $("#mannschaft-details-delete-keep-spieler-button")
    this.delete_remove_spieler_button = $("#mannschaft-details-delete-remove-spieler-button")
  }

  /* DISPLAY */

  displayMannschaft(mannschaft){
    this.mannschaft = mannschaft
    // Show this view
    this.card_div.removeClass("display-none")
    // Display values
    this.name_header.text(this.mannschaft.name)
    this.liga_input.val(this.mannschaft.liga)
    this.sollstaerke_select.val(this.mannschaft.sollstaerke)
    this.spieltag_select.val(this.mannschaft.spieltag)
    this.uhrzeit_input.val(this.mannschaft.uhrzeit)
    this.spielwoche_select.val(this.mannschaft.spielwoche)
    
  }

  /* HIDE */

  hide(){
    this.card_div.addClass("display-none")
  }

  /* LIGA */

  bindEditLigaOnMannschaft(handler) {
    this.liga_input.on("keyup", (event) => { this._editLigaKeyUpHandler(event, handler) } )
    this.liga_input.focusout( () => { this._editLigaFocusOutHandler(event, handler) } )
  }

  _editLigaKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit Liga
    if (event.keyCode === 13) {
      this._editLiga(handler)
      this.liga_input.blur()
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.liga_input.val(this.mannschaft.liga)
      this.liga_input.blur()
    }
  }

  _editLigaFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.liga_input.val()
    // If not empty we edit Liga
    if (input !== "") { 
      this._editLiga(handler)
    // Else we cancel
    } else {
      this.liga_input.val(this.mannschaft.liga)
    }
  }

  _editLiga(handler){
    // Get the inputs
    var newLiga = this.liga_input.val()
    // Fire the handler if necessary
    if (newLiga !== this.mannschaft.liga ) {
      handler(this.mannschaft.id, newLiga)
    }
  }

  /* SOLLSTAERKE */

  bindEditSollstaerkeOnMannschaft(handler) {
    this.sollstaerke_select.on("change", (event) => this._editSollstaerkeChangeHandler(event, handler))
  }

  _editSollstaerkeChangeHandler(event, handler) {
    event.preventDefault()
    var input = this.sollstaerke_input.val()
    // If not empty we edit Liga
    if (input !== "") { 
      this._editSollstaerke(handler)
    // Else we cancel
    } else {
      this.sollstaerke_input.val(this.mannschaft.sollstaerke)
    }
  }

  _editSollstaerke(handler){
    // Get the inputs
    var newSollstaerke= this.sollstaerke_input.val()
    // Fire the handler if necessary
    if (newSollstaerke !== this.mannschaft.sollstaerke ) {
      handler(this.mannschaft.id, newSollstaerke)
    }
  }

  /* SPIELTAG */

  bindEditSpieltagOnMannschaft(handler) {
    // TODO
  }

  /* UHRZEIT */

  bindEditUhrzeitOnMannschaft(handler) {
    this.uhrzeit_input.on("keyup", (event) => { this._editUhrzeitKeyUpHandler(event, handler) } )
    this.uhrzeit_input.focusout( () => { this._editUhrzeitFocusOutHandler(event, handler) } )
  }

  _editUhrzeitKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit Uhrzeit
    if (event.keyCode === 13) {
      this._editUhrzeit(handler)
      this.uhrzeit_input.blur()
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.uhrzeit_input.val(this.mannschaft.uhrzeit)
      this.uhrzeit_input.blur()
    }
  }

  _editUhrzeitFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.uhrzeit_input.val()
    // If not empty we edit Uhrzeit
    if (input !== "") { 
      this._editUhrzeit(handler)
    // Else we cancel
    } else {
      this.uhrzeit_input.val(this.mannschaft.uhrzeit)
    }
  }

  _editUhrzeit(handler){
    // Get the inputs
    var newUhrzeit = this.uhrzeit_input.val()
    // Fire the handler if necessary
    if (newUhrzeit !== this.mannschaft.uhrzeit ) {
      handler(this.mannschaft.id, newUhrzeit)
    }
  }

  /* SPIELWOCHE */

  bindEditSpielwocheOnMannschaft(handler) {
    // TODO
  }

  /* DELETE */

  bindClickDeleteButtonOnMannschaft(handler) {
    // TODO
  }

  /* CLOSE */

  bindClickCloseButtonOnSidebar(handler){
    this.close_button.click( (event) => { handler() })
  }

}