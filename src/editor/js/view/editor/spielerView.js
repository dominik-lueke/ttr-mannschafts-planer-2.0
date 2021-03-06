class SpielerView {
  constructor(spielerListeContainer, spieler, planung) {
      // Add the li for the Spieler
      // Do not display spieler.ttrdifferenz for the very first Spieler.
      this.spieler = spieler
      const ttrdifferenz = `${spieler.mannschaft}.${spieler.position}` != "1.1" ? spieler.ttrdifferenz : "";
      const ttrdifferenzVorzeichen = ttrdifferenz > 0 ? "+" : ""
      this.spielerHasSpv = ( spieler.spv.primary || spieler.spv.secondary > 0 )
      this.spvEditable = ( spieler.spv.primary && spieler.spv.secondary == 0 )
      this.invalidSpielerFromHigherMannschaften = spieler.invalidSpielerFromHigherMannschaften
      this.spielklasse_slug = spieler.spielklasse.replace(" ","")
      this.spielerHtmlId = `spieler-${this.spielklasse_slug}-${spieler.id}`
      // Create the HTML Markup
      this.spieler_div = $(`<li id="${this.spielerHtmlId}" class="list-group-item spieler spieler-farbe-${spieler.farbe} link" mannschaft="${spieler.mannschaft}" spielerid="${spieler.id}" spielklasse="${spieler.spielklasse}" position="${spieler.position}"></li>`)
      this.spieler_flex_div = $(`<div class="d-flex"></div>`)
      this.spieler_flex_div.append( this.spieler_position_div = $(`<div id="${this.spielerHtmlId}-position" class="p-2 text-muted">${spieler.mannschaft}.${spieler.position}</div>`) )
      this.spieler_flex_div.append( this.spieler_name_div = $(`<div id="${this.spielerHtmlId}-name" class="p-2 flex-grow-1 spieler-name">${spieler.name}</div>`) )
      this.spieler_name_div.append( this.spieler_res_badge = $(`<span class="badge badge-secondary ml-2 display-none">RES</span>`) )
      this.spieler_name_div.append( this.spieler_sbe_badge = $(`<span class="badge badge-secondary ml-2 display-none">SBE</span>`) )
      this.spieler_flex_div.append( this.spieler_spv_div = $(`<div id="${this.spielerHtmlId}-spv" class="p-2 spv"></div>`) )
      this.spieler_spv_div.append( this.spieler_spv_badge = $(`<span class="badge badge-danger spv-badge" data-toggle="tooltip" data-placement="right" title="Sperrvermerk setzen">SPV</span>`) )
      this.spieler_flex_div.append( this.spieler_qttr_div = $(`<div id="${this.spielerHtmlId}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>`) )
      this.spieler_flex_div.append( this.spieler_ttrdifferenz_div = $(`<div id="${this.spielerHtmlId}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>`) )
      this.spieler_flex_div.append( this.spieler_invalid_icon = $(`<div id="${this.spielerHtmlId}-invalid-icon" class="p-2 spieler-invalid-icon text-danger"><span><i class="fa fa-exclamation-triangle"></i></span></div>`) )
      this.spieler_div.append(this.spieler_flex_div)
      if (spieler.kommentar !== "") {
        this.spieler_print_kommentar_flex_div = $(`<div class="display-none spieler-print-kommentar"></div>`)
        this.spieler_print_kommentar_flex_div.append( this.spieler_print_kommentar = $(`<div id="${this.spielerHtmlId}-print-kommentar" class="pl-2 pb-1 text-muted"><small><i class="fa fa-comment-o"></i> ${spieler.kommentar}</small></div>`) )
        this.spieler_div.append(this.spieler_print_kommentar_flex_div)
      }
      spielerListeContainer.append(this.spieler_div)

      // color the ttr-differenz
      this.spieler_ttrdifferenz_div.addClass(ttrdifferenz < 0 ? "text-success" : ttrdifferenz > 0 ? "text-danger" : "")
      // special case for qttr = 0
      if ( spieler.qttr === 0 ) {
        this.spieler_qttr_div.html('<i class="fa fa-question-circle" title="(Q)TTR Wert unbekannt" data-toggle="tooltip"></i>')
        this.spieler_ttrdifferenz_div.html('')
      }
      // add RES and SBE Badges
      if ( this.spieler.reserve ) { 
        this.spieler_res_badge.removeClass("display-none")
        this.spieler_name_div.addClass("text-muted")
      }
      if ( this.spieler.sbe ) { 
        this.spieler_sbe_badge.removeClass("display-none")
      }

      // add invalid class, invalid-icon, tooltip
      const spieler_invalid_reihenfolge = 
        ( spieler.invalid && spieler.invalid.length > 0 ) && 
        ( spieler.invalid.some(invalid_spieler => invalid_spieler.mannschaft == spieler.mannschaft) || ! this.spielerHasSpv )
      
      if ( spieler_invalid_reihenfolge || spieler.wrongAgeForSpielklasse ){
        this.spieler_div.addClass("invalid")
        this.spieler_div.addClass("spieler-invalid")
        this.spieler_invalid_icon.attr("data-toggle","tooltip")
        this.spieler_invalid_icon.attr("data-placement","right")
        this.spieler_invalid_icon.attr("data-html","true")
        var tooltip_title = ""
        if ( spieler.wrongAgeForSpielklasse ) {
          tooltip_title += "<h6>Falsches Alter</h6>"
          tooltip_title += "Der Spieler darf aufgrund seines Alters nicht in dieser Spielklasse gemeldet werden.<br/>"
        }
        if (spieler_invalid_reihenfolge ) {
          tooltip_title += "<h6>Ung??ltige Reihenfolge</h6>"
          var i = 2
          for (var invalid_spieler of spieler.invalid ) {
            tooltip_title += `<b>${invalid_spieler.mannschaft}.${invalid_spieler.position} ${invalid_spieler.name}</b><br/>+${invalid_spieler.differenz} TTR-Punkte<br/>`
            i -= 1
            if ((i == 0) && (spieler.invalid.length - 2) !== 0 ){
              tooltip_title += `und <b>${spieler.invalid.length - 2} weitere</b>`
              break
            }
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
      const spv_setzen_title    = planung.halbserie === "Vorrunde" ? "Sperrvermerk setzen" : "Achtung! Zur R??ckrunde darf ein Sperrvermerk nur gesetzt werden, damit der Spieler in seiner Mannschaft verbleiben kann (vgl. WO H 2.4)."
      const spv_entfernen_title = planung.halbserie === "Vorrunde" ? "Sperrvermerk entfernen" : "Achtung! Zur R??ckrunde darf ein Sperrvermerk nur entfernt werden, wenn der Spieler auch ohne diesen in seiner bisherigen Mannschaft oder einer unteren gemeldet werden darf (vgl. WO H 2.4)."
      if ( ! this.spielerHasSpv ){
        this.spieler_spv_badge.removeClass("badge-danger")
        this.spieler_spv_badge.addClass("badge-light")
        this.spieler_spv_badge.addClass("link")
        this.spieler_spv_badge.attr("title", spv_setzen_title)
      } else {
        this.spieler_div.addClass("spv-set")
        this.spieler_spv_badge.attr("title",spv_entfernen_title)
      }
      if ( this.invalidSpielerFromHigherMannschaften > 0 ) {
        this.spieler_div.addClass("spv-possible")
        this.spieler_spv_badge.attr("title",spv_setzen_title)
      }
      if ( this.spvEditable ) {
        this.spieler_spv_badge.addClass("link")
      } else if (this.spielerHasSpv) {
        this.spieler_spv_badge.attr("title","")
      }
      // add extra hover to spv-badge to hightlight the spieler which would also recieve a spv on higher positionen in the same mannschaft
      this.spieler_spv_badge.hover(
        () => { if ( ! this.spielerHasSpv ) { this._addHighlightsToSpvSpieler() } },
        () => { if ( ! this.spielerHasSpv ) { this._removeHighlightsFromSpvSpieler() } }
      )
      // add marker for TTR-Werte, which are earlier than the TTR-Werte from the planung
      if (this.spieler.qttrdate.getTime() < planung.ttrwerte.date.getTime()){
        this.spieler_qttr_div.addClass("spieler-qttr-outdated")
        this.spieler_qttr_div.attr("data-toggle","tooltip")
        this.spieler_qttr_div.attr("data-placement","top")
        this.spieler_qttr_div.attr("title","Der QTTR-Wert dieses Spielers ist ??lter als die anderen in der Planung geladenen TTR-Werte")
        this.spieler_qttr_div.tooltip()
      } else {
        this.spieler_qttr_div.removeClass("spieler-qttr-outdated")
        this.spieler_qttr_div.tooltip('dispose')
      }

  }

  /* NAME */

  bindClickOnSpieler(handler) {
    this.spieler_div.click( (event) => { 
      handler(this.spieler.id)
    })
  }

  /* SPV BADGE */

  bindToggleSpvOnSpieler(handler) {
    this.spieler_spv_badge.click( (event) => { 
      if ( this.spieler_spv_badge.hasClass("link") ){ 
        this.spieler_spv_badge.tooltip('dispose')
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

  /* INVALID SPIELER HIGHLIGHTS */

  _addHighlightsToInvalidSpieler(){
    this.spieler.invalid.forEach(invalid_spieler => {
      $(`#spieler-${this.spielklasse_slug}-${invalid_spieler.id}`).addClass("highlight-invalid")
    })
  }

  _removeHighlightsFromInvalidSpieler(){
    this.spieler.invalid.forEach(invalid_spieler => {
      $(`#spieler-${this.spielklasse_slug}-${invalid_spieler.id}`).removeClass("highlight-invalid")
    })
  }

  delete() {
    this.spieler_div.remove()
  }

}