class EditorView {
  constructor() {
    $('#editor').append(`
      <div class="container editor-container">
        <div class="row">
          <div class="col-8">
            <div id="mannschafts-container" class="container">
            </div>
            <div class="container">
              <div class="row mannschafts-row">
                <div class="card mannschaft">
                  <button class="btn btn-light text-muted">
                    <i class="fa fa-plus"></i>
                    Mannschaft hinzufügen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    this.mannschaftsContainer = $('#mannschafts-container')
    this.mannschaftViews = []
    this.reorderSpielerHandler = {}
  }

  displayMannschaften(mannschaften, spieler) {
    // Delete all nodes execpt the "Mannschaft hinzufügen" button
    this.mannschaftViews.forEach( mannschaft => { mannschaft.delete() })
    this.mannschaftViews = []

    // Create Mannschafts rows for each Mannschaft in state
    mannschaften.forEach(mannschaft => {
      const mannschaftsspieler = spieler.filter(spieler => spieler.mannschaft === mannschaft.nummer).sort((a,b) => { return a.position - b.position })
      this.mannschaftViews.push( new MannschaftView(this.mannschaftsContainer, mannschaft, mannschaftsspieler) )
    })

    // Activate sorting
    $(".connectedSortable").sortable({
      connectWith: ".connectedSortable",
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

    // activate tooltips
    $('[data-toggle="tooltip"]').tooltip();
  }

  /* MANNSCHAFT BINDINGS */

  bindClickOnMannschaft(handler) {
    this.mannschaftViews.forEach(mannschaft => { mannschaft.bindClickOnMannschaft(handler)})
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

}