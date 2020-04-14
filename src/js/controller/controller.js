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
    this.newPlanungModalView = new NewPlanungModalView()
    // Parser
    this.myTTParser = new MyTTParser()
    
    // Initial Display
    this.updateView()

    // Bind Model Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.planung.bindHeaderDataChanged(this.onHeaderDataChanged)

    // Bind View Handlers
    this.editorView.bindAddMannschaft(this.handleAddMannschaft)
    this.editorView.bindClickOnLadeAufstellungLink(this.handleClickOnLadeAufstellungLink)
    this.editorView.bindClickOnNeuePlanungButton(this.createNewPlanung)
    this.headerView.bindClickOnReloadDataButon(this.handleClickOnReloadDataButton)
    // MYTTMODAL VIEW
    this.myTTModalView.bindHtmlParser("aufstellung", this.parseAufstellungHtml)
    this.myTTModalView.bindParseResultAnalyzer("aufstellung", this.getAufstellungsParseResult)
    this.myTTModalView.bindClickOnLoadButtonOnMyTTModalTab("aufstellung", this.handleClickAufstellungLadenButtonOnMyTTModal)
    this.myTTModalView.bindHtmlParser("ttrwerte", this.parseTtrRanglisteHtml)
    this.myTTModalView.bindParseResultAnalyzer("ttrwerte", this.getTtrRanglisteParseResult)
    this.myTTModalView.bindClickOnLoadButtonOnMyTTModalTab("ttrwerte", this.handleClickTTRWerteLadenButtonOnMyTTModal)
    this.myTTModalView.bindHtmlParser("bilanzen", this.parseBilanzenHtml)
    this.myTTModalView.bindParseResultAnalyzer("bilanzen", this.getBilanzenParseResult)
    this.myTTModalView.bindClickOnLoadButtonOnMyTTModalTab("bilanzen", this.handleClickBilanzenLadenButtonOnMyTTModal)
    // NEWPLANUNGS VIEW
    this.newPlanungModalView.bindClickSubmitPlanungButton(this.handleClickSubmitPlanungButton)
    // SIDEBAR VIEW
    this.sidebarView.bindClickCloseButtonOnSidebar(this.handleClickCloseButtonOnSidebar)
    // SIDEBAR SPIELER VIEW
    this.sidebarView.bindEditNameOnSpieler(this.handleEditNameOnSpieler)
    this.sidebarView.bindEditQttrOnSpieler(this.handleEditQttrOnSpieler)
    this.sidebarView.bindClickResButtonOnSpieler(this.handleClickResButtonOnSpieler)
    this.sidebarView.bindClickSbeButtonOnSpieler(this.handleClickSbeButtonOnSpieler)
    this.sidebarView.bindClickFarbeButtonOnSpieler(this.handleClickFarbeButtonOnSpieler)
    this.sidebarView.bindEditKommentarOnSpieler(this.handleEditKommentarOnSpieler)
    this.sidebarView.bindClickDeleteButtonOnSpieler(this.handleClickDeleteButtonOnSpieler)
    // SIDEBAR MANNSCHAFT VIEW
    this.sidebarView.bindEditLigaOnMannschaft(this.handleEditLigaOnMannschaft)
    this.sidebarView.bindEditSollstaerkeOnMannschaft(this.handleEditSollstaerkeOnMannschaft)
    this.sidebarView.bindEditSpieltagOnMannschaft(this.handleEditSpieltagOnMannschaft)
    this.sidebarView.bindEditUhrzeitOnMannschaft(this.handleEditUhrzeitOnMannschaft)
    this.sidebarView.bindEditSpielwocheOnMannschaft(this.handleEditSpielwocheOnMannschaft)
    this.sidebarView.bindClickDeleteButtonOnMannschaft(this.handleClickDeleteButtonOnMannschaft)
  }

  /* PLANUNG */
  createNewPlanung = () => {
    // close current planung
    this.closePlanung()
    // Show Planungs Modal
    this.newPlanungModalView.displayPlanungModal()
  }

  closePlanung = () => {
    // New planung
    this.model.createNewPlanung()
    this.planung = this.model.planung
    // Bind Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.planung.bindHeaderDataChanged(this.onHeaderDataChanged)
    // reset and hide Planungs Modal
    this.newPlanungModalView.destroyPlanungModal()
    this.newPlanungModalView = new NewPlanungModalView()
    this.newPlanungModalView.bindClickSubmitPlanungButton(this.handleClickSubmitPlanungButton)
    // Initial Display
    this.updateView()
  }

  handleClickSubmitPlanungButton = (planung_json) => {
    this.model.updatePlanung(planung_json)
  }

  /* UPDATE */
  updateView = () => {
    this.onHeaderDataChanged(this.planung)
    this.onMannschaftenChanged(this.planung)
  }

  onHeaderDataChanged = () => {
    this.headerView.updateHeader(this.planung)
    this.myTTModalView.setHomeUrl("aufstellung", this.planung.aufstellung.url)
    this.myTTModalView.setHomeUrl("ttrwerte", this.planung.ttrwerte.url)
    this.myTTModalView.setHomeUrl("bilanzen", this.planung.bilanzen.url)
  }

  onMannschaftenChanged = (planung) => {
    this.editorView.displayMannschaften(planung)
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
      this.sidebarView.displaySpieler(spieler, this.planung.compareHalbserien)
      this.editorView.focusSpieler(spieler)
    } else if (display == "mannschaft") {
      const mannschaft = this.planung.mannschaften.getMannschaft(id)
      this.sidebarView.displayMannschaft(mannschaft)
      this.editorView.focusMannschaft(mannschaft)
    } else {
      this.sidebarView.hideSidebar()
      this.editorView.removeFocus()
    }
  }

  /* HEADER HANDLER */

  handleClickOnReloadDataButton = (tab, url) => {
    this.myTTModalView.loadUrl(tab, url)
  }

  /* MYTT MODAL WEBVIEW HANDLER */

  parseAufstellungHtml = (url, html) => {
    return this.myTTParser.parseMyTTAufstellung(url, html)
  }

  parseTtrRanglisteHtml = (url, html) => {
    return this.myTTParser.parseMyTTTtrRangliste(url, html)
  }

  parseBilanzenHtml = (url, html) => {
    return this.myTTParser.parseMyTTBilanzen(url, html)
  }

  getAufstellungsParseResult = (planung) => {
    return this.myTTParser.getResultOfMyTTAufstellungsParser(planung)
  }

  getTtrRanglisteParseResult = (planung) => {
    return this.myTTParser.getResultOfMyTTTtrRanglisteParser(planung, this.planung.verein)
  }

  getBilanzenParseResult = (planung) => {
    return this.myTTParser.getResultOfMyTTBilanzenParser(planung, this.planung.verein)
  }

  handleClickAufstellungLadenButtonOnMyTTModal = (planung_json) => {
    this.planung.loadFromJSON(planung_json, true)
    // Assume if we load the Aufstellung of a Serie, we want to start planning the next 
    // Load RR-2019/20 -> Plan VR-2020/21
    this.planung.increaseSerie()
  }

  handleClickTTRWerteLadenButtonOnMyTTModal = (planung_json) => {
    this.planung.loadFromJSON(planung_json)
  }

  handleClickBilanzenLadenButtonOnMyTTModal = (planung_json) => {
    this.planung.loadFromJSON(planung_json)
  }

  /* EDITOR HANDLER */

  handleClickOnLadeAufstellungLink = () => {
    this.myTTModalView.loadUrl('aufstellung', this.planung.aufstellung.url)
  }

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