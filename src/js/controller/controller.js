class Controller {
  constructor() {
    // Model
    this.model = new Model()
    this.planung = this.model.planung // only one planung at a time right now
    // Views
    this.headerView = new HeaderView()
    this.editorView = new EditorView()
    this.sidebarView = new SidebarView()
    this.myTTModalView = new MyTTModalView()
    // Parser
    this.myTTParser = new MyTTParser()
    
    // Initial Display
    this.onHeaderDataChanged(this.planung)
    this.onMannschaftenChanged(this.planung.mannschaften.liste, this.planung.spieler.liste)

    // Bind Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.planung.bindHeaderDataChanged(this.onHeaderDataChanged)
    this.editorView.bindAddMannschaft(this.handleAddMannschaft)
    this.headerView.bindClickOnReloadDataButon(this.handleClickOnReloadDataButton)
    this.myTTModalView.bindAufstellungsHtmlParser( this.parseAufstellungHtml )
    this.myTTModalView.bindClickLadeAufstellungOnMyTTModal(this.handleClickAufstellungLadenButtonOnMyTTModal)
    // SIDEBAR
    this.sidebarView.bindClickCloseButtonOnSidebar(this.handleClickCloseButtonOnSidebar)
    // SIDEBAR SPIELER
    this.sidebarView.bindEditNameOnSpieler(this.handleEditNameOnSpieler)
    this.sidebarView.bindEditQttrOnSpieler(this.handleEditQttrOnSpieler)
    this.sidebarView.bindClickResButtonOnSpieler(this.handleClickResButtonOnSpieler)
    this.sidebarView.bindClickSbeButtonOnSpieler(this.handleClickSbeButtonOnSpieler)
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

  onHeaderDataChanged = () => {
    this.headerView.updateHeader(this.planung)
    this.myTTModalView.setHomeUrl(this.planung.mytt.aufstellung.url)
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

  /* HEADER HANDLER */

  handleClickOnReloadDataButton = (url) => {
    this.myTTModalView.loadUrl(url)
  }

  /* MYTT MODAL WEBVIEW HANDLER */

  parseAufstellungHtml = (url, html) => {
    return this.myTTParser.parseMyTTAufstellung(url, html)
  }

  handleClickAufstellungLadenButtonOnMyTTModal = (planung_json) => {
    this.planung.loadFromJSON(planung_json, true)
    // Assume if we load the Aufstellung of a Serie, we want to start planning the next 
    // Load RR-2019/20 -> Plan VR-2020/21
    this.planung.increaseSerie()
  }

  /* EDITOR HANDLER */
  handleAddMannschaft = (nummer) => {
    this.model.addMannschaft(nummer)
  }

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

  handleClickResButtonOnSpieler = (id, res) => {
    this.planung.editSpielerRes(id, res)
  }

  handleClickSbeButtonOnSpieler = (id, sbe) => {
    this.planung.editSpielerSbe(id, sbe)
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
    this.planung.editMannschaftSpielwoche(id, spielwoche)
  }

  handleClickDeleteButtonOnMannschaft = (id, keep_spieler) => {
    this.model.deleteMannschaft(id, keep_spieler)
  }

}