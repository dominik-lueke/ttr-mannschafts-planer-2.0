class SpielerView {
  constructor(spielerListeContainer, spieler) {
      // Add the li for the Spieler
      // Do not display spieler.ttrdifferenz for the very first Spieler.
      const ttrdifferenz = `${spieler.mannschaft}.${spieler.position}` != "1.1" ? spieler.ttrdifferenz : "";
      const ttrdifferenzVorzeichen = ttrdifferenz > 0 ? "+" : ""
      this.html = $(`
        <li id="spieler-${spieler.spielklasse}-${spieler.id}" class="list-group-item spieler">
          <div class="d-flex">
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-position" class="p-2 text-muted">${spieler.mannschaft}.${spieler.position}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-name" class="p-2 flex-grow-1 link">${spieler.name}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-spv" class="p-2 spv"><span class="badge badge-danger spv-badge">SPV</span></div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>
          </div>
        </li>
      `)
      spielerListeContainer.append(this.html)
      // color the ttr-differenz
      $(`#spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz`).addClass(ttrdifferenz < 0 ? "text-success" : ttrdifferenz > 0 ? "text-danger" : "")
      // cache spieler_div
      const spieler_div = $(`#spieler-${spieler.spielklasse}-${spieler.id}`)
      // add invalid class, tooltip
      if (spieler.invalid && spieler.invalid.length > 0) {
        spieler_div.addClass("invalid")
        spieler_div.addClass("spieler-invalid")
        spieler_div.attr("data-toggle","tooltip")
        spieler_div.attr("data-placement","right")
        spieler_div.attr("data-html","true")
        var tooltip_title = "<b>Ungültige Reihenfolge</b><br/>"
        var i = 2
        for (var invalid_spieler of spieler.invalid ) {
          tooltip_title += `<br/><b>${invalid_spieler.mannschaft}.${invalid_spieler.position} ${invalid_spieler.name}</b> +${invalid_spieler.differenz} TTR-Punkte<br/>`
          i -= 1
          if (i == 0) {
            tooltip_title += `<br/>und <b>${spieler.invalid.length - 2} weitere</b>`
            break
          }
        }
        spieler_div.attr("title",tooltip_title)
      }
      // add spv-badge
      if ( ! spieler.spv ){
        const spv_badge = $(`#spieler-${spieler.spielklasse}-${spieler.id}-spv span`)
        spv_badge.removeClass("badge-danger")
        spv_badge.addClass("badge-light")
      }
      if (spieler.invalid && spieler.invalid.some(invalid_spieler => invalid_spieler.mannschaft != spieler.mannschaft)) {
        spieler_div.addClass("spv-possible")
      }

  }

  delete() {
    this.html.remove()
  }

}