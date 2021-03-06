class MannschaftDetailsView {
  constructor(container) {
    this.mannschaft = undefined
    // HEADER
    this.header = `
      <div class="card-header bg-white">
        <div class="d-flex">
          <div class="pt-1 pr-1 text-muted">
            <div id="mannschaft-details-icon" class="rounded-circle text-center bg-secondary text-white sidebar-details-icon"><span></span></div>
          </div>
          <div class="p-2 flex-grow-1">
            <h5 id="mannschaft-details-name-header"></h5>
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
      <div id="mannschaft-details-view-body" class="card-body">
        <h6 class="text-muted">Liga <small>(Mannschaftsstärke)</small></h6>
        <div class="form-row mb-4">
          <div class="col-sm-9">
            <input id="mannschaft-details-liga-input" type="text" class="form-control form-control-sm" value="" placeholder="Liga">
          </div>
          <div class="col-sm-3">
            <select id="mannschaft-details-sollstaerke-select" class="form-control form-control-sm">
              <option value="6">6er</option>
              <option value="5">5er</option>
              <option value="4">4er</option>
              <option value="3">3er</option>
              <option value="2">2er</option>
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
          <div class="col-sm-3">
            <input id="mannschaft-details-uhrzeit-input" type="text" class="form-control form-control-sm" placeholder="19:30">
          </div>
          <div class="col-sm-3">
          <select id="mannschaft-details-spielwoche-select" class="form-control form-control-sm">
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          </div>
        </div>
        <h6 class="text-muted">Kommentar</h6>
        <div class="form-row mb-4">
          <div class="col">
            <input id="mannschaft-details-comment-input" class="form-control form-control-sm" type="text"></textarea>
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
          <button id="mannschaft-details-delete-keep-spieler-button" class="btn btn-outline-success mr-1 flex-fill display-none mannschaft-delete-dialog">
            <small>
              <i class="fa fa-check"></i>
              <span id="mannschaft-details-delete-keep-spieler-button-text"> </span>
              Spieler behalten
            </small>
          </button>
          <button id="mannschaft-details-delete-remove-spieler-button" class="btn btn-outline-danger mr-1 ml-1 flex-fill display-none mannschaft-delete-dialog">
            <small>
              <i class="fa fa-trash"></i>
              <span id="mannschaft-details-delete-remove-spieler-button-text"> </span>
              Spieler auch löschen
            </small>
          </button>
          <button id="mannschaft-details-delete-abort-button" class="btn btn-danger ml-1 flex-fill display-none mannschaft-delete-dialog">
            <small>
              <i class="fa fa-times"></i>
              Abbrechen
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
    this.mannschaft_icon = $("#mannschaft-details-icon span")
    this.liga_input = $("#mannschaft-details-liga-input")
    this.sollstaerke_select = $("#mannschaft-details-sollstaerke-select")
    this.spieltag_select = $("#mannschaft-details-spieltag-select")
    this.uhrzeit_input = $("#mannschaft-details-uhrzeit-input")
    this.spielwoche_select = $("#mannschaft-details-spielwoche-select")
    this.comment_input = $("#mannschaft-details-comment-input")
    this.delete_button = $("#mannschaft-details-delete-button")
    this.delete_keep_spieler_button = $("#mannschaft-details-delete-keep-spieler-button")
    this.delete_keep_spieler_button_text = $("#mannschaft-details-delete-keep-spieler-button-text")
    this.delete_remove_spieler_button = $("#mannschaft-details-delete-remove-spieler-button")
    this.delete_remove_spieler_button_text = $("#mannschaft-details-delete-remove-spieler-button-text")
    this.delete_abort_button = $("#mannschaft-details-delete-abort-button")
    this.delete_dialog = $(".mannschaft-delete-dialog")
    // bind ui handler
    this.delete_abort_button.click( (event) => {
      $(".mannschaft-delete-dialog").addClass("display-none")
      this.delete_button.removeClass("display-none")
    })
  }

  /* DISPLAY */

  displayMannschaft(mannschaft){
    this.mannschaft = mannschaft
    // Show this view
    this.card_div.removeClass("display-none")
    // Display values
    this.mannschaft_icon.text(this.mannschaft.romanNumber)
    this.name_header.text(this.mannschaft.name)
    this.liga_input.val(this.mannschaft.liga)
    this.sollstaerke_select.val(this.mannschaft.sollstaerke)
    this.spieltag_select.val(this.mannschaft.spieltag)
    this.uhrzeit_input.val(this.mannschaft.uhrzeit)
    this.spielwoche_select.val(this.mannschaft.spielwoche)
    this.comment_input.val(this.mannschaft.kommentar)
    this.delete_button.removeClass("display-none")
    this.delete_dialog.addClass("display-none")
    // Bilanzen
    $('#mannschaft-details-view-body-bilanzen-form-row').remove()
    if ( Object.keys(this.mannschaft.bilanzen).length !== 0 ) {
      $('#mannschaft-details-view-body').append(`
        <div id="mannschaft-details-view-body-bilanzen-form-row" class="form-row mb-4">
          <div class="col">
            <h6 class="text-muted">Bilanzen</h6>
            <div class="accordion" id="mannschaft-details-view-body-bilanzen">
            </div>
          </div>
        </div>
      `)
      var bilanzen_container = $('#mannschaft-details-view-body-bilanzen')
      var sorted_saison_keys = Object.keys(this.mannschaft.bilanzen).sort(COMPARE_HALBSERIEN)
      var expanded = 'true'
      var show = 'show'
      var collapsed = ''
      sorted_saison_keys.forEach( saison_key => {
        var saison = this.mannschaft.bilanzen[saison_key]
        var saison_id = saison_key.replace('/','-')
        var saison_card = $(`
          <div class="card card-collapseable border-0">
            <div class="card-header border-bottom-0 p-0 bg-white ${collapsed}" data-toggle="collapse" data-target="#mannschaft-details-view-body-bilanzen-${saison_id}" aria-expanded="${expanded}" aria-controls="mannschaft-details-view-body-bilanzen-${saison_id}">
              <h7 class="text-muted link">
                <small><i class="fa fa-caret-down ml-1"></i></small>
                ${saison.halbserie} ${saison.saison} 
                <small>
                  <a href="${saison.url}" class="text-success pr-2" data-toggle="tooltip" data-placement="top" title="Öffne Mannschafts-Informationen bei myTischtennis.de">
                    <i class="fa fa-external-link"></i>
                  </a>
                </small>
              </h7>
            </div>
            <div id="mannschaft-details-view-body-bilanzen-${saison_id}" class="collapse ${show}" data-parent="#mannschaft-details-view-body-bilanzen">
              <div class="card-body p-0">
              </div>
            </div>
          </div>`
        )
        var saison_table = $(`
          <table class="table table-sm mt-2" >
            <thead class="thead-light">
              <tr>
                <th class="text-center">#</th>
                <th>Spieler</th>
                <th>E</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>ges.</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>`
        )
        var bilanzen_tablebody = saison_table.find('tbody')
        var max_einsaetze_in_mannschaft = 0
        saison.bilanzen.forEach( spieler => {
          var bilanzen_tablerow = $(`
            <tr>
              <td>${spieler.rang}</td>
              <td class="bilanzen-spieler-name">${spieler.name}</td>
              <td class="bilanzen-stammspieler-einsaetze">${spieler.einsaetze} </td>
              <td>${spieler[1]}</td>
              <td>${spieler[2]}</td>
              <td>${spieler[3]}</td>
              <td>${spieler[4]}</td>
              <td>${spieler[5]}</td>
              <td>${spieler[6]}</td>
              <td>${spieler.gesamt}</td>
            </tr>
          `)
          if (parseInt(spieler.einsaetze,10) > max_einsaetze_in_mannschaft) {
            max_einsaetze_in_mannschaft = parseInt(spieler.einsaetze,10)
          }
          if (parseInt(spieler.rang.split('.')[0],10) !== mannschaft.nummer){
            bilanzen_tablerow.find('.bilanzen-stammspieler-einsaetze').removeClass('bilanzen-stammspieler-einsaetze')
          }
          bilanzen_tablebody.append(bilanzen_tablerow)
        })
        // Add warning icons to spieler with few einsätze
        bilanzen_tablebody.find('.bilanzen-stammspieler-einsaetze').each( (index,element) => {
          var einsaetze = parseInt( $(element).text(),10 )
          if (einsaetze < (max_einsaetze_in_mannschaft / 2)) {
            $(element).append('<small><i class="fa fa-warning text-warning" data-toggle="tooltip" data-placement="right" title="Spieler hatte wenige Einsätze in dieser Halbserie"></i></small>')
          }
        })
        // Append card to sidebar
        saison_card.find(".card-body").append(saison_table)
        bilanzen_container.append(saison_card)
        saison_card.find('[data-toggle="tooltip"]').tooltip('dispose').tooltip()
        expanded = 'false'
        show = ''
        collapsed = 'collapsed'
      })
    }
  }

  /* HIDE */

  hide(){
    // first save changes made from previous displayed mannschaft
    // by using the focusout handler of the respective inputs
    if (this.mannschaft !== undefined && ! this.card_div.hasClass("display-none")) {
      this.liga_input.blur()
      this.comment_input.blur()
    }
    // hide
    this.card_div.addClass("display-none")
    this.card_div.find('[data-toggle="tooltip"]').tooltip('dispose').tooltip()
  }

  /* LIGA */

  bindEditLigaOnMannschaft(handler) {
    this.liga_input.on("keyup", (event) => { this._editLigaKeyUpHandler(event, handler) } )
    this.liga_input.focusout( (event) => { this._editLigaFocusOutHandler(event, handler) } )
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
    var input = parseInt(this.sollstaerke_select.val(), 10)
    this._editSollstaerke(handler, input)
  }

  _editSollstaerke(handler, newSollstaerke){
    // Fire the handler if necessary
    if (newSollstaerke !== this.mannschaft.sollstaerke ) {
      handler(this.mannschaft.id, newSollstaerke)
    }
  }

  /* SPIELTAG */

  bindEditSpieltagOnMannschaft(handler) {
    this.spieltag_select.on("change", (event) => this._editSpieltagChangeHandler(event, handler))
  }

  _editSpieltagChangeHandler(event, handler) {
    event.preventDefault()
    var input = this.spieltag_select.val()
    this._editSpieltag(handler, input)
  }

  _editSpieltag(handler, newSpieltag){
    // Fire the handler if necessary
    if (newSpieltag !== this.mannschaft.spieltag ) {
      handler(this.mannschaft.id, newSpieltag)
    }
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
    this.spielwoche_select.on("change", (event) => this._editSpielwocheChangeHandler(event, handler))
  }

  _editSpielwocheChangeHandler(event, handler) {
    event.preventDefault()
    var input = this.spielwoche_select.val()
    this._editSpielwoche(handler, input)
  }

  _editSpielwoche(handler, newSpielwoche){
    // Fire the handler
    if (newSpielwoche !== this.mannschaft.spielwoche ) {
      handler(this.mannschaft.id, newSpielwoche)
    }
  }

  /* KOMMENTAR */

  bindEditKommentarOnMannschaft(handler){
    this.comment_input.on("keyup", (event) => { this._editKommentarKeyUpHandler(event, handler) } )
    this.comment_input.focusout( (event) => { this._editKommentarFocusOutHandler(event, handler) } )
  }

  _editKommentarKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit kommentar
    if (event.keyCode === 13) {
      this._editKommentar(handler)
      this.comment_input.blur()
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.comment_input.val(this.mannschaft.kommentar)
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
    if (newkommentar !== this.mannschaft.kommentar ) {
      handler(this.mannschaft.id, newkommentar)
    }
  }

  /* DELETE */

  bindClickDeleteButtonOnMannschaft(handler) {
    this.delete_button.click( (event) => { this._clickDeleteButtonHandler(event, handler)})
    this.delete_keep_spieler_button.click( (event) => { this._clickDeleteConfirmButtonHandler(event, handler, true)})
    this.delete_remove_spieler_button.click( (event) => { this._clickDeleteConfirmButtonHandler(event, handler, false)})
  }

  _clickDeleteButtonHandler(event, handler) {
    // A bit hacky here toget the number of mannschaften and spieler in this mannschaft via jquery...
    const number_of_mannschaften = $(`#mannschafts-container > .mannschafts-row`).length
    const spieler_in_mannschaft = $(`#mannschaft-${this.mannschaft.spielklasse}-${this.mannschaft.nummer}-spielerliste li`).length
    if ( spieler_in_mannschaft == 0) {
      // directly delete mannschaft if there are no spieler in the mannschaft
      this._clickDeleteConfirmButtonHandler(event, handler, false)
    } else {
      this.delete_button.addClass("display-none")
      this.delete_dialog.removeClass("display-none")
      this.delete_keep_spieler_button_text.text(spieler_in_mannschaft)
      this.delete_remove_spieler_button_text.text(spieler_in_mannschaft)
      if ( number_of_mannschaften == 1 ) {
        // do not offer to keep the spieler if this is the only mannschaft
        this.delete_keep_spieler_button.addClass("display-none")
      }
    }
  }

  _clickDeleteConfirmButtonHandler(event, handler, keep_spieler) {
    event.preventDefault()
    // Fire the handler
    handler(this.mannschaft.id, keep_spieler)
  }

  /* CLOSE */

  bindClickCloseButtonOnSidebar(handler){
    this.close_button.click( (event) => { handler() })
  }

}