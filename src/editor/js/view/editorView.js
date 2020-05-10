class EditorView {
  constructor() {
    $('#editor').append(`
      <div class="container editor-container">
        <div class="row">
          <div id="editor-col" class="col-12 col-sm-8 col-md-6" >
            <div id="mannschafts-container" class="container connected-sortable-mannschaft">
            </div>
            <div id="add-mannschaft-button-container" class="container">
              <div class="row mannschafts-row">
                <div class="empty-planung-message text-center mannschaft mb-3 display-none">
                  <h6 class="mb-3">Es existieren noch keine Mannschaften oder Spieler</h6>
                  <h6 class="mb-3">Lege manuell welche an</h6>
                </div>
                <div class="card mannschaft">
                  <button id="add-mannschaft-button" class="btn btn-light text-muted">
                    <i class="fa fa-plus"></i>
                    Mannschaft hinzufügen
                  </button>
                </div>
                <div class="empty-planung-message text-center mannschaft mt-3 display-none">
                  <h6 class="mb-3">oder</h6>
                  <h6 class="link text-success" id="lade-aufstellung-link" data-toggle="modal" data-target="#planung-reload-data-modal">lade eine Aufstellung von myTischtennis.de</h6>
                </div>
              </div>
            </div>
          </div>
          <div id="neue-planung-col" class="col-12 mt-4 display-none">
            <div class="container pt-4">
              <div class="row mannschafts-row">
                <div id="neue-planung-button" class="text-center card mannschaft pt-4 pb-4 link">
                  <h1><i class="fa fa-file-o" /></h1>
                  <h6>Neue Saisonplanung starten</h6>
                </div>
              </div>
              <div class="row mannschafts-row">
                <div id="oeffne-planung-button" class="text-center card mannschaft pt-4 pb-4 link">
                  <h1><i class="fa fa-folder-open-o" /></h1>
                  <h6>Saisonplanung öffnen</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    this.editor_col = $('#editor-col')
    this.neue_planung_col = $('#neue-planung-col')
    this.mannschaftsContainer = $('#mannschafts-container')
    this.add_mannschaft_button = $('#add-mannschaft-button')
    this.empty_planung_message = $('.empty-planung-message')
    this.lade_aufstellung_link = $('#lade-aufstellung-link')
    this.neue_planung_button = $('#neue-planung-button')
    this.oeffne_planung_button = $('#oeffne-planung-button')
    this.mannschaftViews = []
    this.reorderSpielerHandler = {}
    this.reorderMannschaftHandler = {}
  }

  displayMannschaften(planung) {
    // Display neue planung 
    if (planung.isNew) {
      this.editor_col.addClass("display-none")
      this.neue_planung_col.removeClass("display-none")
    } else {
      this.editor_col.removeClass("display-none")
      this.neue_planung_col.addClass("display-none")
    }
    // mannschaften und spieler
    const mannschaften = planung.mannschaften.liste
    const spieler = planung.spieler.liste

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
      this.mannschaftViews.push( new MannschaftView(this.mannschaftsContainer, mannschaft, mannschaftsspieler, mannschaften.length) )
    })

    // Activate sorting
    this.activateDragDrop()

    // activate tooltips
    $('[data-toggle="tooltip"]').tooltip();
  }

  /* DRAG-DROP */
  activateDragDrop() {
    // SPIELER
    $(".connected-sortable-spieler").sortable({
      connectWith: ".connected-sortable-spieler",
      update: (event, ui) => {
        // handle reordering
        const old_position_array = $("#" + ui.item.attr("id") + "-position").text().split(".") // MANNSCHAFT.POSITION
        const old_mannschaft = parseInt(old_position_array[0],10)
        const old_position = parseInt(old_position_array[1],10)
        const new_mannschaft = parseInt(ui.item.parent().attr("id").split("-")[2],10) // mannschaft-SPIELKLASSE->NUMMER<-spielerliste
        const new_position = ui.item.index() + 1
        if (old_mannschaft != new_mannschaft || old_position != new_position) {
          const id = parseInt(ui.item.attr("id").split("-")[2],10) // spieler-SPIELKLASSE->ID<
          this.reorderSpielerHandler(id, new_mannschaft, new_position)
        }
      },
      start: (event, ui) => {
        // deactivate tooltips
        $(`#${ui.item.attr("id")}-invalid-icon`).tooltip("dispose")
        $(`#${ui.item.attr("id")} .ttr-wert`).tooltip("dispose")
      },
      stop: (event, ui) => {
        // activate tooltips again
        $('[data-toggle="tooltip"]').tooltip();
      }
    }).disableSelection();

    // MANNSCHAFTEN
    $(".connected-sortable-mannschaft").sortable({
      connectWith: ".connected-sortable-mannschaft",
      update: (event, ui) => {
        // handle reordering
        const old_mannschaft = parseInt(ui.item.children('.mannschaft').attr("id").split("-")[2],10)// mannschaft-SPIELKLASSE->NUMMER<-spielerliste
        const new_mannschaft = ui.item.index() + 1
        if ( old_mannschaft != new_mannschaft ) {
          this.reorderMannschaftHandler(old_mannschaft, new_mannschaft)
        }
      },
      start: (event, ui) => {
        // deactivate tooltips
        $(`#${ui.item.attr("id")}-invalid-icon`).tooltip("dispose")
      },
      stop: (event, ui) => {
        // activate tooltips again
        $('[data-toggle="tooltip"]').tooltip();
      }
    }).disableSelection();
  }

  /* PLANUNG */
  bindClickOnNeuePlanungButton(handler) {
    this.neue_planung_button.click( (event) => { handler() } )
  }

  bindClickOnOeffnePlanungButton(handler) {
    this.oeffne_planung_button.click( (event) => { handler() } )
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
    this.add_mannschaft_button.click( (event) => { handler(this.mannschaften.length + 1)})
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

  bindReorderSpieler(handler) {
    this.reorderSpielerHandler = handler
  }

  bindReorderMannschaft(handler) {
    this.reorderMannschaftHandler = handler
  }

  /* FOCUS WITH OPEN OR CLOSED SIDEBAR */

  focusSpieler(spieler){
    this.removeFocus()
    $(`#spieler-${spieler.spielklasse}-${spieler.id}`).addClass("spieler-focused")
  }

  focusMannschaft(mannschaft){
    this.removeFocus()
    $(`#mannschaft-${mannschaft.spielklasse}-${mannschaft.nummer}`).addClass("mannschaft-focused")
  }

  removeFocus(){
    $(".spieler-focused").removeClass("spieler-focused")
    $(".mannschaft-focused").removeClass("mannschaft-focused")
  }

}