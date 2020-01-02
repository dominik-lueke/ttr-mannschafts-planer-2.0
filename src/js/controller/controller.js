class Controller {
  constructor(model, headerView, editorView, sidebarView) {
    this.planung = model.planung // only one planung at a time right now
    this.headerView = headerView
    this.editorView = editorView
    this.sidebarView = sidebarView

    // Initial Display
    this.onHeaderDataChanged(this.planung)
    this.onMannschaftenChanged(this.planung.mannschaften.liste, this.planung.spieler.liste)

    // Bind Handlers 
    this.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
  }

  onHeaderDataChanged = planung => {
    this.headerView.updateHeader(planung)
  }

  onMannschaftenChanged = (mannschaften,spieler) => {
    this.editorView.displayMannschaften(mannschaften,spieler)
    this.editorView.bindAddSpieler(this.handleAddSpieler)
    this.editorView.bindToggleSpvOnSpieler(this.handleToggleSpvOnSpieler)
    this.editorView.bindEditQttrOnSpieler(this.handleEditQttrOnSpieler)
    this.editorView.bindReorderSpieler(this.handleReorderSpieler)
  }

  handleAddSpieler = (spielklasse, mannschaft, position, name, qttr) => {
    /* The spielklasse can later be used to have more than one planungs-objcet */
    this.planung.addSpieler(mannschaft, position, name, qttr)
  }

  handleReorderSpieler = (id, new_mannschaft, new_position, spielklasse) => {
    this.planung.reorderSpieler(id, new_mannschaft, new_position, spielklasse)
  }

  handleToggleSpvOnSpieler = (id, spv) => {
    this.planung.editSpielerSpv(id, spv)
  }

  handleEditQttrOnSpieler = (id, qttr) => {
    this.planung.editSpielerQttr(id, qttr)
  }

}