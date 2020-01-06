class SpielerDetailsView {

  constructor(container) {
    this.spieler = {}
    // HEADER
    this.header = `
      <div class="card-header bg-white">
        <div class="d-flex">
          <div class="p-2 text-muted">
            <i class="fa fa-2x fa-address-card"></i>
          </div>
          <div class="p-2 flex-grow-1">
            <input id="spieler-details-name-input" type="text" class="form-control form-control-sm" value=""/>
          </div>
          <div class="pl-2 pt-2 pr-0">
            <button id="spieler-details-close-button" type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          </div>
        </div>
    `
    // BODY
    this.body = `
      <div class="card-body">
        <div class="form-row mb-4">
          <div class="col">
            <h6 class="text-muted">QTTR</h6>
            <input id="spieler-details-qttr-input" type="number" class="form-control form-control-sm" value="" >
          </div>
          <div class="col">
            <h6 class="text-muted">Sonderstatus</h6>
            <span id="spieler-details-sbe-badge" class="badge badge-light spieler-extra-icon" data-toggle="tooltip" data-placement="top" data-html="true" title="Reservespieler">RES</span>
            <span id="spieler-details-res-badge" class="badge badge-light spieler-extra-icon" data-toggle="tooltip" data-placement="top" data-html="true" title="Senioren Berechtigung">SBE</span>
          </div>
        </div>
        <div class="form-row mb-4">
          <div class="col">
            <h6 class="text-muted">Farbe</h6>
            <div class="d-flex">
              <a><div id="spieler-details-farbe-default" class="alert alert-light text-dark p-2 spieler-farbe-selector">Aa</div></a>
              <a><div id="spieler-details-farbe-green"   class="alert alert-success p-2 spieler-farbe-selector">Aa</div></a>
              <a><div id="spieler-details-farbe-red"     class="alert alert-danger p-2 spieler-farbe-selector">Aa</div></a>
              <a><div id="spieler-details-farbe-yellow"  class="alert alert-warning p-2 spieler-farbe-selector">Aa</div></a>
              <a><div id="spieler-details-farbe-blue"    class="alert alert-info p-2 spieler-farbe-selector">Aa</div></a>
              <a><div id="spieler-details-farbe-light"   class="alert alert-light p-2 spieler-farbe-selector">Aa</div></a>
            </div>
          </div>
        </div>
        <div class="form-row mb-4">
          <div class="col">
            <h6 class="text-muted">Kommentar</h6>
            <textarea id= "spieler-details-comment-input" class="form-control" id="exampleFormControlTextarea1" rows="2">Kommentar</textarea>
          </div>
        </div>
      </div>
    `
    // FOOTER
    this.footer = `
      <div class="card-footer bg-white">
        <div class="d-flex">
        <button id="spieler-details-delete-button" class="flex-fill btn btn-outline-danger">
          <small>
            <i class="fa fa-trash"></i>
            Spieler entfernen
          </small>
        </button>
        </div>
      </div>
    `
    this.html = `
      <div id="spieler-details-view" class="card bg-white display-none">
        ${this.header}
        ${this.body}
        ${this.footer}
      </div>
    `
    container.append(this.html)
    // cache jq elements
    this.card_div = $(`#spieler-details-view`)
    this.name_input = $("#spieler-details-name-input")
    this.close_button = $("#spieler-details-close-button")
    this.qttr_input = $("#spieler-details-qttr-input")
    this.sbe_badge = $("#spieler-details-sbe-badge")
    this.res_badge = $("#spieler-details-res-badge")
    this.farbe_selectors = {
      "default": $("#spieler-details-farbe-default"),
      "green":   $("#spieler-details-farbe-green"),
      "red":     $("#spieler-details-farbe-red"),
      "yellow":  $("#spieler-details-farbe-yellow"),
      "blue":    $("#spieler-details-farbe-blue"),
      "light":   $("#spieler-details-farbe-light")
    }
    this.comment_input = $("#spieler-details-comment-input")
    this.delete_button = $("#spieler-details-delete-button")
  }

  /* DISPLAY */
  displaySpieler(spieler){
    this.spieler = spieler
    // Show this view
    this.card_div.removeClass("display-none")
    // Normal Inputs
    this.name_input.val(this.spieler.name)
    this.qttr_input.val(this.spieler.qttr)
    this.comment_input.val(this.spieler.kommentar)
    // Badges
    if (this.spieler.sbe) {
      this.sbe_badge.addClass("badge-dark").removeClass("badge-light")
    } else {
      this.sbe_badge.addClass("badge-light").removeClass("badge-dark")
    }
    if (this.spieler.reserve) {
      this.res_badge.addClass("badge-dark").removeClass("badge-light")
    } else {
      this.res_badge.addClass("badge-light").removeClass("badge-dark")
    }
    // Farbe-Selector
    $(".spieler-farbe-selector").removeClass("active")
    if (this.spieler.farbe in this.farbe_selectors){
      this.farbe_selectors[this.spieler.farbe].addClass("active")
    } else {
      this.farbe_selectors["default"].addClass("active")
    }
  }

  hide(){
    this.card_div.addClass("display-none")
  }

  /* CLOSE */
  bindClickCloseButtonOnSidebar(handler){
    this.close_button.click( (event) => { handler() })
  }
  
  /* NAME */
  bindEditNameOnSpieler(handler){
    this.name_input.on("keyup", (event) => { this._editNameKeyUpHandler(event, handler) } )
    this.name_input.focusout( () => { this._editNameFocusOutHandler(event, handler) } )
  }

  _editNameKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit name
    if (event.keyCode === 13) {
      this._editName(handler)
      this.name_input.blur()
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.name_input.val(this.spieler.name)
      this.name_input.blur()
    }
  }

  _editNameFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.name_input.val()
    // If not empty we edit name
    if (input !== "") { 
      this._editName(handler)
    // Else we cancel
    } else {
      this.name_input.val(this.spieler.name)
    }
  }

  _editName(handler){
    // Get the inputs
    var newname = this.name_input.val()
    // Fire the handler if necessary
    if (newname !== this.spieler.name ) {
      handler(this.spieler.id, newname)
    }
  }

  /* QTTR */
  bindEditQttrOnSpieler(handler){
    this.qttr_input.on("keyup", (event) => { this._editQttrKeyUpHandler(event, handler) } )
    this.qttr_input.focusout( () => { this._editQttrFocusOutHandler(event, handler) } )
  }

  _editQttrKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit qttr
    if (event.keyCode === 13) {
      this._editQttr(handler)
      this.qttr_input.blur()
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.qttr_input.removeClass("is-invalid") 
      this.qttr_input.val(this.spieler.qttr)
      this.qttr_input.blur()
    }
  }

  _editQttrFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.qttr_input.val()
    // If not empty we edit qttr
    if (input !== "") { 
      this._editQttr(handler)
    // Else we cancel
    } else {
      this.qttr_input.removeClass("is-invalid") 
      this.qttr_input.val(this.spieler.qttr)
    }
  }

  _editQttr(handler){
    // Get the inputs
    var newqttr = parseInt(this.qttr_input.val(), 10)
    // Test if inputs are valid
    if ( newqttr !== parseInt(newqttr, 10) || newqttr <= 0 ) { 
      this.qttr_input.addClass("is-invalid") 
    } else {
      // Fire the handler if necessary
      this.qttr_input.removeClass("is-invalid") 
      if (newqttr !== this.spieler.qttr ) {
        handler(this.spieler.id, newqttr)
      }
    }
  }

  /* SBE */

  /* RES */

  /* FARBE */
  bindClickFarbeButtonOnSpieler(handler){
    $(".spieler-farbe-selector").click( (event) => { this._changeSpielerFarbe(event, handler) })
  }

  _changeSpielerFarbe(event, handler) {
    handler(this.spieler.id, event.target.id.replace("spieler-details-farbe-", ""))
  }

  /* KOMMENTAR */
  bindEditKommentarOnSpieler(handler){
    this.comment_input.on("keyup", (event) => { this._editKommentarKeyUpHandler(event, handler) } )
    this.comment_input.focusout( () => { this._editKommentarFocusOutHandler(event, handler) } )
  }

  _editKommentarKeyUpHandler(event, handler) {
    event.preventDefault()
    if (event.keyCode === 27) {
      this.comment_input.val(this.spieler.kommentar)
      this.comment_input.blur()
    }
  }

  _editKommentarFocusOutHandler(event, handler) {
    event.preventDefault()
    this._editKommentar(handler)
  }

  _editKommentar(handler){
    // Get the inputs
    var newkommentar = this.comment_input.val()
    // Fire the handler if necessary
    if (newkommentar !== this.spieler.comment ) {
      handler(this.spieler.id, newkommentar)
    }
  }

  /* LÖSCHEN */

}
