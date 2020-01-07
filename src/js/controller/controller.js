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
    this.onSidebarViewChanged()

    // Bind Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    // SIDEBAR
    this.sidebarView.bindClickCloseButtonOnSidebar(this.handleClickCloseButtonOnSidebar)
    // SIDEBAR SPIELER
    this.sidebarView.bindEditNameOnSpieler(this.handleEditNameOnSpieler)
    this.sidebarView.bindEditQttrOnSpieler(this.handleEditQttrOnSpieler)
    this.sidebarView.bindClickFarbeButtonOnSpieler(this.handleClickFarbeButtonOnSpieler)
    this.sidebarView.bindEditKommentarOnSpieler(this.handleEditKommentarOnSpieler)
    this.sidebarView.bindClickDeleteButtonOnSpieler(this.handleClickDeleteButtonOnSpieler)
    // SIDEBAR MANNSCHAFT
    this.sidebarView.bindEditLigaOnMannschaft(this.handleEditLigaOnMannschaft)
    this.sidebarView.bindEditSollstaerkeOnMannschaft(this.handleEditSollstaerkeOnMannschaft)
    this.sidebarView.bindEditSpieltagOnMannschaft(this.handleEditSpieltagOnMannschaft)
    this.sidebarView.bindEditUhrzeitOnMannschaft(this.handleEditUhrzeitOnMannschaft)
    this.sidebarView.bindEditSpielwocheOnMannschaft(this.handleEditSpielwocheOnMannschaft)
    this.sidebarView.bindClickDeleteButtonOnMannschaft(this.handleClickDeleteButtonOnMannschaft)
  }

  /* UPDATE */

  onHeaderDataChanged = planung => {
    this.headerView.updateHeader(planung)
  }

  onMannschaftenChanged = (mannschaften,spieler) => {
    this.editorView.displayMannschaften(mannschaften,spieler)
    this.editorView.bindClickOnMannschaft(this.handleClickOnMannschaft)
    this.editorView.bindAddSpieler(this.handleAddSpieler)
    this.editorView.bindClickOnSpieler(this.handleClickOnSpieler)
    this.editorView.bindToggleSpvOnSpieler(this.handleToggleSpvOnSpieler)
    this.editorView.bindReorderSpieler(this.handleReorderSpieler)
    this.onSidebarViewChanged()
  }

  onSidebarViewChanged = () => {
    const display = this.model.view.sidebar.display 
    const id = this.model.view.sidebar.id
    if (display == "spieler") {
      const spieler = this.planung.spieler.getSpieler(id)
      this.sidebarView.displaySpieler(spieler)
    } else if (display == "mannschaft") {
      const mannschaft = this.planung.mannschaften.getMannschaft(id)
      this.sidebarView.displayMannschaft(mannschaft)
    } else {
      this.sidebarView.hideSidebar()
    }
  }

  /* HANDLER */

  /* EDITOR HANDLER */

  handleAddSpieler = (spielklasse, mannschaft, position, name, qttr) => {
    /* The spielklasse can later be used to have more than one planungs-objcet */
    this.model.addSpieler(mannschaft, position, name, qttr)
  }

  handleReorderSpieler = (id, new_mannschaft, new_position) => {
    this.planung.reorderSpieler(id, new_mannschaft, new_position)
  }

  handleClickOnSpieler = (id) => {
    this.model.displaySpielerDetails(id)
  }

  handleClickOnMannschaft = (id) => {
    this.model.displayMannschaftDetails(id)
  }

  handleToggleSpvOnSpieler = (id, spv) => {
    this.planung.editSpielerSpv(id, spv)
  }

  /* SIDEBAR HANDLER */

  handleClickCloseButtonOnSidebar = () => {
    this.model.closeSidebar()
  }

  /* SIDEBAR SPIELER HANDLER */

  handleEditNameOnSpieler = (id, name) => {
    this.planung.editSpielerName(id, name)
  }

  handleEditQttrOnSpieler = (id, qttr) => {
    this.planung.editSpielerQttr(id, qttr)
  }

  handleClickFarbeButtonOnSpieler = (id, farbe) => {
    this.planung.editSpielerFarbe(id, farbe)
  }

  handleEditKommentarOnSpieler = (id, kommentar) => {
    this.planung.editSpielerKommentar(id, kommentar)
  }

  handleClickDeleteButtonOnSpieler = (id) => {
    this.model.deleteSpieler(id)
  }

  /* SIDEBAR MANNSCHAFT HANDLER */

  handleEditLigaOnMannschaft = (id, liga) => {
    this.planung.editMannschaftLiga(id, liga)
  }

  handleEditSollstaerkeOnMannschaft = (id, sollstaerke) => {
    this.planung.editMannschaftSollstaerke(id, sollstaerke)
  }

  handleEditSpieltagOnMannschaft = (id, spieltag) => {
    this.planung.editMannschaftSpieltag(id, spieltag)
  }

  handleEditUhrzeitOnMannschaft = (id, uhrzeit) => {
    this.planung.editMannschaftUhrzeit(id, uhrzeit)
  }

  handleEditSpielwocheOnMannschaft = (id, spielwoche) => {
    this.planung.editMannschaftUhrzeit(id, spielwoche)
  }

  handleClickDeleteButtonOnMannschaft = (id) => {
    this.model.deleteMannschaft(id)
  }

}