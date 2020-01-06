class Controller {
  constructor(model, headerView, editorView, sidebarView) {
    this.model = model
    this.planung = this.model.planung // only one planung at a time right now
    this.headerView = headerView
    this.editorView = editorView
    this.sidebarView = sidebarView

    // Initial Display
    this.onHeaderDataChanged(this.planung)
    this.onMannschaftenChanged(this.planung.mannschaften.liste, this.planung.spieler.liste)

    // Bind Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.sidebarView.bindEditQttrOnSpieler(this.handleEditQttrOnSpieler)
    this.sidebarView.bindClickCloseButtonOnSidebar(this.handleClickCloseButtonOnSidebar)
  }

  onHeaderDataChanged = planung => {
    this.headerView.updateHeader(planung)
  }

  onMannschaftenChanged = (mannschaften,spieler) => {
    this.editorView.displayMannschaften(mannschaften,spieler)
    this.editorView.bindAddSpieler(this.handleAddSpieler)
    this.editorView.bindClickOnSpielerName(this.handleClickOnSpieler)
    this.editorView.bindToggleSpvOnSpieler(this.handleToggleSpvOnSpieler)
    this.editorView.bindReorderSpieler(this.handleReorderSpieler)
  }

  onSidebarViewChanged = (category, id) => {
    if (category == "spieler") {
      const spieler = this.planung.spieler.getSpieler(id)
      this.sidebarView.displaySpieler(spieler)
    } else if (category == "mannschaft") {
      // TODO
    } else {
      this.sidebarView.hideSidebar()
    }
  }

  handleAddSpieler = (spielklasse, mannschaft, position, name, qttr) => {
    /* The spielklasse can later be used to have more than one planungs-objcet */
    this.planung.addSpieler(mannschaft, position, name, qttr)
  }

  handleReorderSpieler = (id, new_mannschaft, new_position) => {
    this.planung.reorderSpieler(id, new_mannschaft, new_position)
  }

  handleClickOnSpieler = (id) => {
    this.model.displaySpielerDetails(id)
  }

  handleToggleSpvOnSpieler = (id, spv) => {
    this.planung.editSpielerSpv(id, spv)
  }

  handleEditQttrOnSpieler = (id, qttr) => {
    this.planung.editSpielerQttr(id, qttr)
  }

  handleClickCloseButtonOnSidebar = () => {
    this.model.closeSidebar()
  }
}