class SpielklasseView {
  constructor(spielklasseContainer, spielklasse, model) {
    this.model = model
    this.planung = model.planung
    this.spielklasse = spielklasse
    this.id = spielklasse.replace(" ","")
    this.html = $(`
      <div id="${this.id}" class="card card-spielklasse card-collapseable mb-4 p-0" spielklasse="${spielklasse}">
        <div class="card-header collapsed link d-flex justify-content-between" data-toggle="collapse" data-target="#${this.id}-card-body" aria-expanded="false" aria-controls="#${this.id}-card-body">
          <h5><small><i class="fa fa-caret-down ml-1"></i></small> ${spielklasse}</h5><small class="spielklasse-infos pl-4 mt-1 text-muted">Mannschaften (Spieler)</small>
        </div>
        <div id="${this.id}-card-body" class="card-body p-0 collapse" data-parent="#${this.id}">
          <div id="${this.id}-mannschafts-container" class="container connected-sortable-mannschaft" spielklasse="${spielklasse}">
          </div>
          <div id="${this.id}-add-mannschaft-button-container" class="container add-mannschaft-button-container">
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
    this.card_header = $(`#${this.id} .card-header`)
    this.card_body = $(`#${this.id}-card-body`)
    this.mannschaftsContainer = $(`#${this.id}-mannschafts-container`)
    this.add_mannschaft_button = $(`#${this.id}-add-mannschaft-button`)
    this.empty_planung_message = $(`.${this.id}-empty-planung-message`)
    this.lade_aufstellung_link = $(`#${this.id}-lade-aufstellung-link`)
    this.spielklasse_infos = this.card_header.find('.spielklasse-infos')
    this.mannschaftViews = []
    this.displayMannschaften(this.planung)
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

    // Fill spielklasse infos in header
    const spielklasse_infos = `${mannschaften.length} Mannschaften (${spieler.length} Spieler)`.replace('0', 'Keine').replace('(0 Spieler)', '')
    this.spielklasse_infos.text(spielklasse_infos)
  }

  delete(){
    this.html.remove()
  }

  /* COLLAPSE */

  expand(){
    this.card_body.collapse('show')
  }

  bindSpielklasseExpanded(handler) {
    this.card_body.on('show.bs.collapse', (event) => { handler(this.model, this.id, true) })
    this.card_body.on('hide.bs.collapse', (event) => { handler(this.model, this.id, false) } )
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