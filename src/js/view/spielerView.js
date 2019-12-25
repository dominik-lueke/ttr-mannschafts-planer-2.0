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
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-spv" class="p-2 spv"></div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>
            <div id="spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>
          </div>
        </li>
      `)
      spielerListeContainer.append(this.html)
      $(`#spieler-${spieler.spielklasse}-${spieler.id}-ttrdifferenz`).addClass(ttrdifferenz < 0 ? "text-success" : ttrdifferenz > 0 ? "text-danger" : "")
  }

  delete() {
    this.html.remove()
  }

}