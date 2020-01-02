class SpielerView {
  constructor(spielerListeContainer, spieler) {
      // Add the li for the Spieler
      // Do not display spieler.ttrdifferenz for the very first Spieler.
      this.spieler = spieler
      const ttrdifferenz = `${spieler.mannschaft}.${spieler.position}` != "1.1" ? spieler.ttrdifferenz : "";
      const ttrdifferenzVorzeichen = ttrdifferenz > 0 ? "+" : ""
      this.spielerHasSpv = ( spieler.spv.primary || spieler.spv.secondary > 0 )
      this.spvEditable = ( spieler.spv.primary && spieler.spv.secondary == 0 )
      this.invalidSpielerFromHigherMannschaften = spieler.invalidSpielerFromHigherMannschaften
      // Create the HTML Markup
      this.spieler_div = $(`<li id="spieler-${spieler.spielklasse}-${spieler.id}" class="list-group-item spieler"></li>`)
      this.spieler_flex_div = $(`<div class="d-flex"></div>`)
      this.spieler_flex_div.append( this.spieler_position_div = $(`<div id="spieler-${spieler.spielklasse}-${spieler.id}-position" class="p-2 text-muted">${spieler.mannschaft}.${spieler.position}</div>`) )
      this.spieler_flex_div.append( this.spieler_name_div = $(`<div id="spieler-${spieler.spielklasse}-${spieler.id}-name" class="p-2 flex-grow-1 link spieler-name">${spieler.name}</div>`) )
      this.spieler_flex_div.append( this.spieler_spv_div = $(`<div id="spieler-${spieler.spielklasse}-${spieler.id}-spv" class="p-2 spv"></div>`) )
      this.spieler_spv_div.append( this.spieler_spv_badge = $(`<span class="badge badge-danger spv-badge">SPV</span>`) )
      this.spieler_flex_div.append( this.spieler_qttr_div = $(`<div id="spieler-${spieler.spielklasse}-${spieler.id}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>`) )
      this.spieler_flex_div.append( this.spieler_ttrdifferenz_div = $(`<div id="spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>`) )
      this.spieler_flex_div.append( this.spieler_qttr_input_div = $(`<div class="p-2 ttr-wert text-muted display-none"></div>`) )
      this.spieler_qttr_input_div.append( this.spieler_qttr_input = $(`<input id="spieler-${spieler.spielklasse}-${spieler.id}-qttr-input" type="number" class="form-control" min="0" max="3000" value="${spieler.qttr}"></input>`) )
      this.spieler_flex_div.append( this.spieler_invalid_icon = $(`<div id="spieler-${spieler.spielklasse}-${spieler.id}-invalid-icon" class="p-2 spieler-invalid-icon text-danger"><span><i class="fa fa-exclamation-triangle"></i></span></div>`) )
      this.spieler_div.append(this.spieler_flex_div)
      spielerListeContainer.append(this.spieler_div)

      // color the ttr-differenz
      $(`#spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz`).addClass(ttrdifferenz < 0 ? "text-success" : ttrdifferenz > 0 ? "text-danger" : "")

      // add invalid class, invalid-icon, tooltip
      if ( 
          ( spieler.invalid && spieler.invalid.length > 0 ) && 
          ( spieler.invalid.some(invalid_spieler => invalid_spieler.mannschaft == spieler.mannschaft) || ! this.spielerHasSpv )
         ) {
        this.spieler_div.addClass("invalid")
        this.spieler_div.addClass("spieler-invalid")
        this.spieler_invalid_icon.attr("data-toggle","tooltip")
        this.spieler_invalid_icon.attr("data-placement","right")
        this.spieler_invalid_icon.attr("data-html","true")
        var tooltip_title = "<h6>Ungültige Reihenfolge</h6>"
        var i = 2
        for (var invalid_spieler of spieler.invalid ) {
          tooltip_title += `<b>${invalid_spieler.mannschaft}.${invalid_spieler.position} ${invalid_spieler.name}</b><br/>+${invalid_spieler.differenz} TTR-Punkte<br/>`
          i -= 1
          if ((i == 0) && (spieler.invalid.length - 2) !== 0 ){
            tooltip_title += `und <b>${spieler.invalid.length - 2} weitere</b>`
            break
          }
        }
        this.spieler_invalid_icon.attr("title",tooltip_title)
      }
      // add extra hover to tooltip to hightlight the spieler which are the reason that this spieler is invalid
      this.spieler_invalid_icon.hover(
        () => { this._addHighlightsToInvalidSpieler() },
        () => { this._removeHighlightsFromInvalidSpieler() }
      )

      // add spv-badge
      if ( ! this.spielerHasSpv ){
        this.spieler_spv_badge.removeClass("badge-danger")
        this.spieler_spv_badge.addClass("badge-light")
        this.spieler_spv_badge.addClass("link")
      } else {
        this.spieler_div.addClass("spv-set")
      }
      if ( this.invalidSpielerFromHigherMannschaften > 0 ) {
        this.spieler_div.addClass("spv-possible")
      }
      if ( this.spvEditable ) {
        this.spieler_spv_badge.addClass("link")
      }
      // add extra hover to spv-badge to hightlight the spieler which would also recieve a spv on higher positionen in the same mannschaft
      this.spieler_spv_badge.hover(
        () => { if ( ! this.spielerHasSpv ) { this._addHighlightsToSpvSpieler() } },
        () => { if ( ! this.spielerHasSpv ) { this._removeHighlightsFromSpvSpieler() } }
      )
      
      // display input form for QTTR instead of label
      this.spieler_qttr_div.attr("data-toggle","tooltip")
      this.spieler_qttr_div.attr("data-placement","right")
      this.spieler_qttr_div.attr("data-html","true")
      this.spieler_qttr_div.attr("title", `<i class="fa fa-pencil"></i>`)
      this.spieler_qttr_div.attr("data-template", '<div class="tooltip" role="tooltip"><div class="edit-tooltip tooltip-inner"></div></div>')
      this.spieler_qttr_div.click( () => { this._displayEditQttrForm() } )
  }

  /* SPV BADGE */

  bindToggleSpvOnSpieler(handler) {
    this.spieler_spv_badge.click( (event) => { 
      if ( this.spieler_spv_badge.hasClass("link") ){ 
        this._toggleSpvHandler(event, handler) 
      } 
    })
  }

  _toggleSpvHandler(event, handler) {
    event.preventDefault()
    handler(this.spieler.id, ! this.spielerHasSpv)
  }

  _addHighlightsToSpvSpieler(){
    // toggle color on our own spv-badge
    this.spieler_spv_badge.addClass("badge-danger")
    this.spieler_spv_badge.removeClass("badge-light")
    // display spv-bage on other spieler with higher positions in same mannschaft
    const prev_spieler = this.spieler_div.prevAll(":not(.spv-set)")
    prev_spieler.addClass("spv-highlight")
    const prev_spieler_spv_badge = prev_spieler.find(".spv-badge")
    prev_spieler_spv_badge.addClass("badge-danger")
    prev_spieler_spv_badge.removeClass("badge-light")
  }

  _removeHighlightsFromSpvSpieler(){
    // toggle color on our own spv-badge
    this.spieler_spv_badge.removeClass("badge-danger")
    this.spieler_spv_badge.addClass("badge-light")
    // hide spv-bage on other spieler with higher positions in same mannschaft
    const prev_spieler = this.spieler_div.prevAll(":not(.spv-set)")
    prev_spieler.removeClass("spv-highlight")
    const prev_spieler_spv_badge = prev_spieler.find(".spv-badge")
    prev_spieler_spv_badge.removeClass("badge-danger")
    prev_spieler_spv_badge.addClass("badge-light")
  }

  /* EDIT QTTR */

  bindEditQttrOnSpieler(handler){
    this.spieler_qttr_input.on("keyup", (event) => { this._editQttrKeyUpHandler(event, handler); } )
    this.spieler_qttr_input.focusout( () => { this._editQttrFocusOutHandler(event, handler); } )
  }

  _editQttrKeyUpHandler(event, handler) {
    event.preventDefault()
    // On <Enter> we edit qttr
    if (event.keyCode === 13) {
      this._editQttr(handler)
    
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this._hideEditQttrForm()
    }
  }

  _editQttrFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.spieler_qttr_input.val()
    // If not empty we edit qttr
    if (input !== "") {
      this._editQttr(handler)
    
    // Else we cancel
    } else  {
      this._hideEditQttrForm()
    }
  }

  _editQttr(handler){
    // Get the inputs
    var newqttr = parseInt(this.spieler_qttr_input.val(), 10)
    // Test if inputs are valid
    if ( newqttr !== parseInt(newqttr, 10) || newqttr <= 0 ) { 
      this.spieler_qttr_input.addClass("is-invalid") 
    } else {
      this.spieler_qttr_div.text(newqttr)
      this._hideEditQttrForm()
      // Fire the handler if necessary
      if (newqttr !== this.spieler.qttr ) {
        handler(this.spieler.id, newqttr)
      }
    }
  }

  _displayEditQttrForm() {
    this.spieler_qttr_div.addClass("display-none")
    this.spieler_ttrdifferenz_div.addClass("display-none")
    this.spieler_qttr_input_div.removeClass("display-none")
    this.spieler_qttr_input.val(this.spieler.qttr)
    this.spieler_qttr_input.focus()
  }

  _hideEditQttrForm() {
    this.spieler_qttr_div.removeClass("display-none")
    this.spieler_ttrdifferenz_div.removeClass("display-none")
    this.spieler_qttr_input_div.addClass("display-none")
  }

  /* INVALID SPIELER HIGHLIGHTS */

  _addHighlightsToInvalidSpieler(){
    this.spieler.invalid.forEach(invalid_spieler => {
      $(`#spieler-${this.spieler.spielklasse}-${invalid_spieler.id}`).addClass("highlight-invalid")
    })
  }

  _removeHighlightsFromInvalidSpieler(){
    this.spieler.invalid.forEach(invalid_spieler => {
      $(`#spieler-${this.spieler.spielklasse}-${invalid_spieler.id}`).removeClass("highlight-invalid")
    })
  }

  delete() {
    this.spieler_div.remove()
  }

}