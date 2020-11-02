class EditorView {
  constructor() {
    $('#editor').append(`
      <div class="container editor-container">
        <div class="row">
          <div id="editor-col" class="col-sm-12 col-md-8 col-lg-7 pl-0 pr-0 mt-4">
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
    this.neue_planung_button = $('#neue-planung-button')
    this.oeffne_planung_button = $('#oeffne-planung-button')
    this.spielklasseViews = []
    this.reorderSpielerHandler = {}
    this.reorderMannschaftHandler = {}
    this.expandSpielklasseHandler = {}
  }

  destroy() {
    this.spielklasseViews.forEach(spielklasse => spielklasse.delete())
    $('#editor').html('')
  }

  displayMannschaften(model) {
    const planung = model.planung
    const view = model.view
    // Display neue planung 
    if (planung.isNew) {
      this.editor_col.addClass("display-none")
      this.neue_planung_col.removeClass("display-none")
    } else {
      this.editor_col.removeClass("display-none")
      this.neue_planung_col.addClass("display-none")
    }
    const spielklassen = SPIELKLASSEN[planung.spielklasse]

    if (spielklassen) {
      if (this.spielklasseViews.length > 0){
        // Fill already present spielklassen
        this.spielklasseViews.forEach(spielklasse => spielklasse.displayMannschaften(planung))
      } else {
        // Create spielklassen new
        Object.keys(spielklassen).forEach(spielklasse => {
          const spielklasseView = new SpielklasseView(this.editor_col, spielklasse, model)
          spielklasseView.bindSpielklasseExpanded(this.expandSpielklasseHandler)
          this.spielklasseViews.push(spielklasseView)
        })
        // hide spielklassen header if there is only 1 spielklasse
        if (Object.keys(spielklassen).length == 1) {
          this.editor_col.addClass("single-spielklasse")
          // Expand the spielklasse
          this.spielklasseViews[0].expand()
        } else {
          this.editor_col.removeClass("single-spielklasse")
          if ( ( view.hasOwnProperty('spielklassenExpanded') && Object.keys(view.spielklassenExpanded).length > 0 ) || 
                model.planung.mannschaften.liste.length > 0 ) 
          {
            // Expand the spielklassen that are stored as expanded
            Object.keys(view.spielklassenExpanded).forEach( spielklasse => {
              if (view.spielklassenExpanded[spielklasse]) {
                const spielklasseView = this.spielklasseViews.find(view => view.id == spielklasse )
                if (spielklasseView){
                  spielklasseView.expand()
                }
              }
            })
          } else {
            // Expand the first spielklasse
            this.spielklasseViews[0].expand()
          }
        }
      }
    }
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
        const old_spielklasse = ui.item.attr("spielklasse")
        const old_mannschaft = parseInt(ui.item.attr("mannschaft"),10)
        const old_position = parseInt(ui.item.attr("position"),10)
        const new_spielerliste_ul = ui.item.parent() // ul spielklasse="" nummer=""
        const new_spielklasse = new_spielerliste_ul.attr("spielklasse")
        const new_mannschaft = parseInt(new_spielerliste_ul.attr("nummer"),10) 
        const new_position = ui.item.index() + 1
        if (old_spielklasse != new_spielklasse || old_mannschaft != new_mannschaft || old_position != new_position) {
          const id = parseInt(ui.item.attr("spielerid"))
          // Be async here to first finish the sorting animation, then update the model and the complete view
          // This takes effect when there are many players and there is a noticable delay when the whole planung is rendered new
          // Effect without timeout: The sorting animation is delayed, then the view is updated and all spieler are correct
          // Effect with timeout:    The sorting animation is smooth, but there is a slight delay until the sorted spieler are updated
          setTimeout ( () => this.reorderSpielerHandler(id, new_spielklasse, new_mannschaft, new_position), 1) 
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
      update: (event, ui) => {
        // handle reordering
        const old_spielklasse = ui.item.attr("spielklasse")
        const new_spielklasse = ui.item.parent().attr("spielklasse")
        const old_mannschaft = parseInt(ui.item.attr("mannschaft"),10)
        const new_mannschaft = ui.item.index() + 1
        if ( old_spielklasse != new_spielklasse || old_mannschaft != new_mannschaft ) {
          this.reorderMannschaftHandler(old_spielklasse, new_spielklasse, old_mannschaft, new_mannschaft)
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
    this.spielklasseViews.forEach(spielklasse => { spielklasse.bindClickOnLadeAufstellungLink(handler)})
  }

  /* MANNSCHAFT BINDINGS */

  bindClickOnMannschaft(handler) {
    this.spielklasseViews.forEach(spielklasse => { spielklasse.bindClickOnMannschaft(handler)})
  }

  bindAddMannschaft(handler) {
    this.spielklasseViews.forEach(spielklasse => { spielklasse.bindAddMannschaft(handler)})
  }

  /* SPIELER BINDINGS */

  bindAddSpieler(handler) {
    this.spielklasseViews.forEach(spielklasse => { spielklasse.bindAddSpieler(handler)})
  }

  bindClickOnSpieler(handler) {
    this.spielklasseViews.forEach(spielklasse => { spielklasse.bindClickOnSpieler(handler)})
  }

  bindToggleSpvOnSpieler(handler) {
    this.spielklasseViews.forEach(spielklasse => { spielklasse.bindToggleSpvOnSpieler(handler)})
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
    const spielklasse_slug = spieler.spielklasse.replace(" ","")
    $(`#spieler-${spielklasse_slug}-${spieler.id}`).addClass("spieler-focused")
  }

  focusMannschaft(mannschaft){
    this.removeFocus()
    const spielklasse_slug = mannschaft.spielklasse.replace(" ","")
    $(`#mannschaft-${spielklasse_slug}-${mannschaft.nummer}`).addClass("mannschaft-focused")
  }

  removeFocus(){
    $(".spieler-focused").removeClass("spieler-focused")
    $(".mannschaft-focused").removeClass("mannschaft-focused")
  }

  /* COLLAPSE SPIELKLASSEN */

  bindSpielklasseExpanded(handler) {
    this.expandSpielklasseHandler = handler
  }

}