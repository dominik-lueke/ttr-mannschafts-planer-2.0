class SpielerView {
  constructor(spielerListeContainer, spieler) {
      // Add the li for the Spieler
      // spieler.ttrdifferenz may be false for the very first Spieler. Do not display it then
      const ttrdifferenz = spieler.ttrdifferenz !== false ? spieler.ttrdifferenz : "";
      const ttrdifferenzVorzeichen = ttrdifferenz > 0 ? "+" : ""
      this.html = $(`
        <li id="spieler-${spieler.id}" class="list-group-item spieler">
          <div class="d-flex">
            <div id="spieler-${spieler.id}-position" class="p-2 text-muted">${spieler.mannschaft}.${spieler.position}</div>
            <div id="spieler-${spieler.id}-name" class="p-2 flex-grow-1 link">${spieler.name}</div>
            <div id="spieler-${spieler.id}-spv" class="p-2 spv"></div>
            <div id="spieler-${spieler.id}-qttr" class="p-2 ttr-wert text-muted">${spieler.qttr}</div>
            <div id="spieler-${spieler.id}-ttrdifferenz" class="p-2 ttr-difference">${ttrdifferenzVorzeichen}${ttrdifferenz}</div>
          </div>
        </li>
      `)
      spielerListeContainer.append(this.html)
      $(`#spieler-${spieler.id}-ttrdifferenz`).addClass(ttrdifferenz < 0 ? "text-success" : ttrdifferenz > 0 ? "text-danger" : "")
  }

  delete() {
    this.html.remove()
  }

}