class SpielklasseView {
  constructor(spielklasseContainer, spielklasse, planung) {
    this.spielklasse = spielklasse
    this.id = spielklasse.replace(" ","")
    this.html = $(`
      <div id="${this.id}" class="card mb-4 p-0" spielklasse="${spielklasse}">
        <div class="card-header link d-flex justify-content-between">
          <h5>${spielklasse}</h5>
          <i class="fa fa-plus-square text-muted mt-2"></i>
        </div>
        <div class="card-body p-0">
          <div id="${this.id}-mannschafts-container" class="container connected-sortable-mannschaft" spielklasse="${spielklasse}">
          </div>
          <div id="${this.id}-add-mannschaft-button-container" class="container">
            <div class="row mannschafts-row">
              <div class="${this.id}-empty-planung-message empty-planung-message text-center mannschaft mb-3 display-none">
                <h6 class="mb-3">Es existieren noch keine Mannschaften oder Spieler</h6>
                <h6 class="mb-3">Lege manuell welche an</h6>
              </div>
              <div class="card mannschaft">
                <button id="${this.id}-add-mannschaft-button" class="btn btn-light text-muted">
                  <i class="fa fa-plus"></i>
                  Mannschaft hinzufügen
                </button>
              </div>
              <div class="${this.id}-empty-planung-message empty-planung-message text-center mannschaft mt-3 display-none">
                <h6 class="mb-3">oder</h6>
                <h6 class="link text-success" id="${this.id}-lade-aufstellung-link" data-toggle="modal" data-target="#planung-reload-data-modal">lade eine Aufstellung von myTischtennis.de</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    spielklasseContainer.append(this.html)
    this.mannschaftsContainer = $(`#${this.id}-mannschafts-container`)
    this.add_mannschaft_button = $(`#${this.id}-add-mannschaft-button`)
    this.empty_planung_message = $(`.${this.id}-empty-planung-message`)
    this.lade_aufstellung_link = $(`#${this.id}-lade-aufstellung-link`)
    this.mannschaftViews = []
    this.displayMannschaften(planung)
  }

  displayMannschaften(planung) {
    const mannschaften = planung.mannschaften.liste.filter(mannschaft => mannschaft.spielklasse == this.spielklasse)
    const spieler = planung.spieler.liste.filter(spieler => spieler.spielklasse == this.spielklasse)

    // Display empty message
    if (mannschaften.length === 0){
      this.empty_planung_message.removeClass("display-none")
    } else {
      this.empty_planung_message.addClass("display-none")
    }

    // Delete all nodes execpt the "Mannschaft hinzufügen" button
    this.mannschaftViews.forEach( mannschaft => { mannschaft.delete() })
    this.mannschaftViews = []
    this.mannschaften = mannschaften

    // Create Mannschafts rows for each Mannschaft in state
    mannschaften.forEach(mannschaft => {
      const mannschaftsspieler = spieler.filter(spieler => spieler.mannschaft === mannschaft.nummer).sort((a,b) => { return a.position - b.position })
      this.mannschaftViews.push( new MannschaftView(this.mannschaftsContainer, mannschaft, mannschaftsspieler, mannschaften.length, planung) )
    })
  }

  delete(){
    this.html.remove()
  }

  /* LADE AUFSTELLUNG LINK */

  bindClickOnLadeAufstellungLink(handler) {
    this.lade_aufstellung_link.click( (event) => { handler() } )
  }

  /* MANNSCHAFT BINDINGS */

  bindClickOnMannschaft(handler) {
    this.mannschaftViews.forEach(mannschaft => { mannschaft.bindClickOnMannschaft(handler)})
  }

  bindAddMannschaft(handler) {
    this.add_mannschaft_button.click( (event) => { handler(this.spielklasse, this.mannschaften.length + 1)})
  }

  /* SPIELER BINDINGS */

  bindAddSpieler(handler) {
    this.mannschaftViews.forEach(mannschaft => { mannschaft.bindAddSpieler(handler)})
  }

  bindClickOnSpieler(handler) {
    this.mannschaftViews.forEach(mannschaft => { mannschaft.bindClickOnSpieler(handler)})
  }

  bindToggleSpvOnSpieler(handler) {
    this.mannschaftViews.forEach(mannschaft => { mannschaft.bindToggleSpvOnSpieler(handler)})
  }

}