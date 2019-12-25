class Controller {
  constructor(model, headerView, editorView, sidebarView) {
    this.model = model
    this.headerView = headerView
    this.editorView = editorView
    this.sidebarView = sidebarView

    // Initial Display
    this.onHeaderDataChanged(this.model.planung)
    this.onMannschaftenChanged(this.model.mannschaften, this.model.spieler)

    // Bind Handlers 
    this.model.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.editorView.bindAddSpieler(this.handleAddSpieler)
    this.editorView.bindReorderSpieler(this.handleReorderSpieler)
  }

  onHeaderDataChanged = planung => {
    this.headerView.updateHeader(planung)
  }

  onMannschaftenChanged = (mannschaften,spieler) => {
    this.editorView.displayMannschaften(mannschaften,spieler)
    this.editorView.bindAddSpieler(this.handleAddSpieler)
  }

  handleAddSpieler = (spielklasse,mannschaft,position,name,qttr) => {
    this.model.addSpieler(spielklasse,mannschaft,position,name,qttr)
  }

  handleReorderSpieler = (id, new_mannschaft, new_position, spielklasse) => {
    this.model.reorderSpieler(id, new_mannschaft, new_position, spielklasse)
  }

}