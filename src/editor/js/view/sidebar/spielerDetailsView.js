class SpielerDetailsView {

  constructor(container) {
    this.spieler = undefined
    // HEADER
    this.header = `
      <div class="card-header bg-white">
        <div class="d-flex">
          <div class="pt-2 pr-1 text-muted">
            <div id="spieler-details-icon" class="rounded-circle text-center text-white sidebar-details-icon" data-toggle="tooltip" data-placement="top"><span></span></div>
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
      <div id="spieler-details-view-body" class="card-body">
        <div class="form-row mb-4">
          <div class="col-4">
            <h6 class="text-muted">
              TTR-Wert 
              <small><i id="qttr-info-icon" class="fa fa-info-circle pr-2" data-toggle="tooltip" data-html="true" data-placement="top" title="QTTR-Info"></i></small>
              <small>
                <a id="mytt-info-link" class="display-none"><i class="fa fa-line-chart text-success" data-toggle="tooltip" data-html="true" data-placement="top" title="TTR-Rangliste"></i></a>
              </small>
            </h6>
            <input id="spieler-details-qttr-input" type="number" class="form-control form-control-sm" value="" >
          </div>
          <div id="spieler-details-jahrgang" class="col-4">
            <h6 class="text-muted">Jahrgang</h6>
            <input id="spieler-details-jahrgang-input" type="number" min="1900" max="${new Date(Date.now()).getFullYear()}" class="form-control form-control-sm" >
          </div>
          <div class="col">
            <h6 class="text-muted">Sonderstatus</h6>
            <span id="spieler-details-res-badge" class="badge ml-2 link" data-toggle="tooltip" data-placement="top" data-html="true" title="<b>Reservespieler</b><br/>Reservespieler zählen nicht zur Sollstärke einer Mannschaft (Ausnahme: Die letzte Mannschaft). Bitte beachte WO H 1.3 zur Vergabe des RES-Status">RES</span>
            <span id="spieler-details-sbe-badge" class="badge ml-2 link" data-toggle="tooltip" data-placement="top" data-html="true" title="<b>Senioren Berechtigung</b><br/>Spieler mit Status SBE haben erhöhte Toleranzen (+35 TTR-Punkte) in Bezug auf die Spielstärkereihenfolge">SBE</span>
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
            <input id="spieler-details-comment-input" class="form-control form-control-sm" type="text"></input>
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
            Spieler löschen
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
    this.spieler_icon_div = $("#spieler-details-icon")
    this.spieler_icon = this.spieler_icon_div.children("span")
    this.qttr_info_icon = $("#qttr-info-icon")
    this.mytt_info_link = $("#mytt-info-link")
    this.name_input = $("#spieler-details-name-input")
    this.close_button = $("#spieler-details-close-button")
    this.qttr_input = $("#spieler-details-qttr-input")
    this.res_badge = $("#spieler-details-res-badge")
    this.sbe_badge = $("#spieler-details-sbe-badge")
    this.jahrgang_div = $("#spieler-details-jahrgang")
    this.jahrgang_input = $("#spieler-details-jahrgang-input")
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
    // ui handler
    this.res_badge.hover(
      () => { this.res_badge.toggleClass("badge-light").toggleClass("badge-dark") },
      () => { this._displayBadge(this.res_badge, this.spieler.reserve) }
    )
    this.sbe_badge.hover(
      () => { this.sbe_badge.toggleClass("badge-light").toggleClass("badge-dark") },
      () => { this._displayBadge(this.sbe_badge, this.spieler.sbe) }
    )

  }

  /* DISPLAY */
  displaySpieler(spieler){
    this.spieler = spieler
    // Show this view
    this.card_div.removeClass("display-none")
    // show elements based on spielklasse
    if (["Herren", "Damen"].includes(this.spieler.spielklasse)){
      this.jahrgang_div.addClass("display-none")
      this.sbe_badge.removeClass("display-none")
    } else {
      this.jahrgang_div.removeClass("display-none")
      this.sbe_badge.addClass("display-none")
    }
    // Icon
    this.spieler_icon.text(this._getSpielerInitialen())
    if (spieler.mytt_id === 0){
      this.spieler_icon_div.addClass("bg-secondary").removeClass("bg-success")
      this.spieler_icon_div.attr("title", "Spieler wurde manuell angelegt")
      this.spieler_icon_div.tooltip('dispose').tooltip();
      this.name_input.removeAttr("disabled")
    } else {
      this.spieler_icon_div.addClass("bg-success").removeClass("bg-secondary")
      this.spieler_icon_div.attr("title", "Spieler wurde von myTischtennis.de geladen")
      this.spieler_icon_div.tooltip('dispose').tooltip();
      this.name_input.attr("disabled","disabled")
    }
    // Qttr-Info
    this.qttr_info_icon.attr("title", spieler.qttrinfo)
    this.qttr_info_icon.tooltip('dispose').tooltip();
    // MyTischtennis Info Link
    const spieler_mytt_url = spieler.getMyTTUrl()
    if ( spieler_mytt_url !== "") {
      this.mytt_info_link.removeClass("display-none")
      this.mytt_info_link.attr('href', spieler_mytt_url)
      const mytt_info_link_icon = this.mytt_info_link.find("i")
      if ( spieler.mytt_id !== 0 ) {
        mytt_info_link_icon.attr("title", "Öffne TTR-Historie bei myTischtennis.de")
        mytt_info_link_icon.addClass("fa-line-chart").removeClass("fa-search")
      } else {
        mytt_info_link_icon.attr("title", "Suche Spieler bei myTischtennis.de")
        mytt_info_link_icon.addClass("fa-search").removeClass("fa-line-chart")
      }
      mytt_info_link_icon.tooltip('dispose').tooltip();
    } else {
      this.mytt_info_link.addClass("display-none")
    }
    // Normal Inputs
    this.name_input.val(this.spieler.name)
    this.qttr_input.val(this.spieler.qttr)
    this.jahrgang_input.val(this.spieler.jahrgang)
    this.comment_input.val(this.spieler.kommentar)
    this._displayBadge(this.res_badge, this.spieler.reserve)
    this._displayBadge(this.sbe_badge, this.spieler.sbe)
    // Farbe-Selector
    $(".spieler-farbe-selector").removeClass("active")
    if (this.spieler.farbe in this.farbe_selectors){
      this.farbe_selectors[this.spieler.farbe].addClass("active")
    } else {
      this.farbe_selectors["default"].addClass("active")
    }
    // Bilanzen
    $('#spieler-details-view-body-bilanzen-form-row').remove()
    if ( Object.keys(this.spieler.bilanzen).length !== 0 ) {
      $('#spieler-details-view-body').append(`
        <div id="spieler-details-view-body-bilanzen-form-row" class="form-row mb-4">
          <div class="col">
            <h6 class="text-muted">Bilanzen</h6>
            <div class="accordion" id="spieler-details-view-body-bilanzen">
            </div>
          </div>
        </div>
      `)
      var bilanzen_container = $('#spieler-details-view-body-bilanzen')
      var sorted_saison_keys = Object.keys(this.spieler.bilanzen).sort(COMPARE_HALBSERIEN)
      var expanded = 'true'
      var show = 'show'
      var collapsed = ''
      sorted_saison_keys.forEach( saison_key => {
        var saison = this.spieler.bilanzen[saison_key]
        var saison_id = saison_key.replace('/','-')
        var saison_card = $(`
          <div class="card card-collapseable border-0">
            <div class="card-header border-bottom-0 p-0 bg-white ${collapsed}" data-toggle="collapse" data-target="#spieler-details-view-body-bilanzen-${saison_id}" aria-expanded="${expanded}" aria-controls="mannschaft-details-view-body-bilanzen-${saison_id}">
              <h7 class="text-muted link">
                <small><i class="fa fa-caret-down ml-1"></i></small>
                ${saison.halbserie} ${saison.saison} 
                <small class="pull-right">Position ${saison.position} - Einsätze: ${saison.bilanzen.reduce((a,c)=>a+c.einsaetze,0)}</small>
              </h7>
            </div>
            <div id="spieler-details-view-body-bilanzen-${saison_id}" class="collapse ${show}" data-parent="#spieler-details-view-body-bilanzen">
              <div class="card-body p-0">
              </div>
            </div>
          </div>`
        )
        var saison_table = $(`
          <table class="table table-sm mt-2">
            <thead class="thead-light">
              <tr>
                <th>Mannschaft</th>
                <th>Einsätze</th>
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
        saison.bilanzen.forEach( mannschaft => {
          bilanzen_tablebody.append(`
            <tr>
              <td>${mannschaft.einsatz_mannschaft}</td>
              <td>${mannschaft.einsaetze}</td>
              <td>${mannschaft[1]}</td>
              <td>${mannschaft[2]}</td>
              <td>${mannschaft[3]}</td>
              <td>${mannschaft[4]}</td>
              <td>${mannschaft[5]}</td>
              <td>${mannschaft[6]}</td>
              <td>${mannschaft.gesamt}</td>
            </tr>
          `)
        })
        // Append card to sidebar
        saison_card.find(".card-body").append(saison_table)
        bilanzen_container.append(saison_card)
        expanded = 'false'
        show = ''
        collapsed = 'collapsed'
      })
    }
  }

  _getSpielerInitialen() {
    var initialen = ""
    this.spieler.name.split(", ").reverse().forEach(subname => { initialen += subname.charAt(0).toUpperCase()})
    return initialen
  }

  _displayBadge(badge, value) {
    if (value) {
      badge.addClass("badge-dark").removeClass("badge-light")
    } else {
      badge.addClass("badge-light").removeClass("badge-dark")
    }
  }

  hide(){
    // first save changes made from previous displayed spieler
    // by using the focusout handler of the respective inputs
    if (this.spieler !== undefined && ! this.card_div.hasClass("display-none")) {
      this.name_input.blur()
      this.qttr_input.blur()
      this.comment_input.blur()
    }
    // hide
    this.card_div.addClass("display-none")
  }

  /* CLOSE */
  bindClickCloseButtonOnSidebar(handler){
    this.close_button.click( (event) => { handler() })
  }
  
  /* NAME */
  bindEditNameOnSpieler(handler){
    this.name_input.on("keyup", (event) => { this._editNameKeyUpHandler(event, handler) } )
    this.name_input.focusout( (event) => { this._editNameFocusOutHandler(event, handler) } )
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
    this.qttr_input.focusout( (event) => { this._editQttrFocusOutHandler(event, handler) } )
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
    if ( newqttr !== parseInt(newqttr, 10) || newqttr < 0 ) { 
      this.qttr_input.addClass("is-invalid") 
    } else {
      // Fire the handler if necessary
      this.qttr_input.removeClass("is-invalid") 
      if (newqttr !== this.spieler.qttr ) {
        handler(this.spieler.id, newqttr)
      }
    }
  }

  /* JAHRGANG */
  bindEditJahrgangOnSpieler(handler){
    this.jahrgang_input.on("keyup", (event) => { this._editJahrgangKeyUpHandler(event, handler) } )
    this.jahrgang_input.focusout( (event) => { this._editJahrgangFocusOutHandler(event, handler) } )
  }

  _editJahrgangKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit jahrgang
    if (event.keyCode === 13) {
      this._editJahrgang(handler)
      this.jahrgang_input.blur()
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.jahrgang_input.removeClass("is-invalid") 
      this.jahrgang_input.val(this.spieler.jahrgang)
      this.jahrgang_input.blur()
    }
  }

  _editJahrgangFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.jahrgang_input.val()
    // If not empty we edit jahrgang
    if (input !== "") { 
      this._editJahrgang(handler)
    // Else we cancel
    } else {
      this.jahrgang_input.removeClass("is-invalid") 
      this.jahrgang_input.val(this.spieler.jahrgang)
    }
  }

  _editJahrgang(handler){
    // Get the inputs
    var newjahrgang = parseInt(this.jahrgang_input.val(), 10)
    // Test if inputs are valid
    if ( newjahrgang !== parseInt(newjahrgang, 10) || newjahrgang < 1900 || newjahrgang > (new Date(Date.now()).getFullYear()) ) { 
      this.jahrgang_input.addClass("is-invalid") 
    } else {
      // Fire the handler if necessary
      this.jahrgang_input.removeClass("is-invalid") 
      if (newjahrgang !== this.spieler.jahrgang ) {
        handler(this.spieler.id, newjahrgang)
      }
    }
  }

  /* RES */
  bindClickResButtonOnSpieler(handler){
    this.res_badge.click( (event) => { this._changeSpielerRes(event, handler) })
  }

  _changeSpielerRes(event, handler){
    event.preventDefault()
    handler(this.spieler.id, ! this.spieler.reserve)
  }

  /* SBE */
  bindClickSbeButtonOnSpieler(handler){
    this.sbe_badge.click( (event) => { this._changeSpielerSbe(event, handler) })
  }

  _changeSpielerSbe(event, handler){
    event.preventDefault()
    handler(this.spieler.id, ! this.spieler.sbe)
  }

  /* FARBE */
  bindClickFarbeButtonOnSpieler(handler){
    $(".spieler-farbe-selector").click( (event) => { this._changeSpielerFarbe(event, handler) })
  }

  _changeSpielerFarbe(event, handler) {
    event.preventDefault()
    handler(this.spieler.id, event.target.id.replace("spieler-details-farbe-", ""))
  }

  /* KOMMENTAR */
  bindEditKommentarOnSpieler(handler){
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
    if (newkommentar !== this.spieler.kommentar ) {
      handler(this.spieler.id, newkommentar)
    }
  }

  /* LÖSCHEN */
  bindClickDeleteButtonOnSpieler(handler){
    this.delete_button.click( (event) => { handler(this.spieler.id) })
  }

}
