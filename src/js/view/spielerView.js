class SpielerView {
  constructor(spielerListeContainer, spieler) {
      // Add the li for the Spieler
      // Do not display spieler.ttrdifferenz for the very first Spieler.
      this.spieler = spieler
      const ttrdifferenz = `${spieler.mannschaft}.${spieler.position}` != "1.1" ? spieler.ttrdifferenz : "";
      const ttrdifferenzVorzeichen = ttrdifferenz > 0 ? "+" : ""
      this.html = $(`
        <li id="spieler-${spieler.spielklasse}-${spieler.id}" class="list-group-item spieler">
          <div class="d-flex">
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-position" class="p-2 text-muted">${spieler.mannschaft}.${spieler.position}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-name" class="p-2 flex-grow-1 link spieler-name">${spieler.name}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-spv" class="p-2 spv"><span class="badge badge-danger spv-badge">SPV</span></div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-invalid-icon" class="p-2 spieler-invalid-icon text-danger"><span><i class="fa fa-exclamation-triangle"></i></span></div>
          </div>
        </li>
      `)
      spielerListeContainer.append(this.html)
      // color the ttr-differenz
      $(`#spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz`).addClass(ttrdifferenz < 0 ? "text-success" : ttrdifferenz > 0 ? "text-danger" : "")
      // cache jq elements
      this.spieler_div = $(`#spieler-${spieler.spielklasse}-${spieler.id}`)
      this.spieler_invalid_icon = $(`#spieler-${spieler.spielklasse}-${spieler.id}-invalid-icon`)
      this.spv_badge = $(`#spieler-${spieler.spielklasse}-${spieler.id}-spv span`)
      // add invalid class, invalid-icon, tooltip
      if (spieler.invalid && spieler.invalid.length > 0) {
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
      if ( ! spieler.spv ){
        this.spv_badge.removeClass("badge-danger")
        this.spv_badge.addClass("badge-light")
      }
      if (spieler.invalid && spieler.invalid.some(invalid_spieler => invalid_spieler.mannschaft != spieler.mannschaft)) {
        this.spieler_div.addClass("spv-possible")
      }
      // add extra hover to spv-badge to hightlight the spieler which would also recieve a spv on higher positionen in the same mannschaft
      this.spv_badge.hover(
        () => { this._addHighlightsToSpvSpieler() },
        () => { this._removeHighlightsFromSpvSpieler() }
      )

  }

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

  _addHighlightsToSpvSpieler(){
    // toggle color on our own spv-badge
    this.spv_badge.addClass("badge-danger")
    this.spv_badge.removeClass("badge-light")
    // display spv-bage on other spieler with higher positions in same mannschaft
    const prev_spieler = this.spieler_div.prevAll()
    prev_spieler.addClass("spv-highlight")
    const prev_spieler_spv_badge = this.spieler_div.prevAll().find(".spv-badge")
    prev_spieler_spv_badge.addClass("badge-danger")
    prev_spieler_spv_badge.removeClass("badge-light")
  }

  _removeHighlightsFromSpvSpieler(){
    // toggle color on our own spv-badge
    this.spv_badge.removeClass("badge-danger")
    this.spv_badge.addClass("badge-light")
    // hide spv-bage on other spieler with higher positions in same mannschaft
    const prev_spieler = this.spieler_div.prevAll()
    prev_spieler.removeClass("spv-highlight")
    const prev_spieler_spv_badge = this.spieler_div.prevAll().find(".spv-badge")
    prev_spieler_spv_badge.removeClass("badge-danger")
    prev_spieler_spv_badge.addClass("badge-light")
  }

  delete() {
    this.html.remove()
  }

}