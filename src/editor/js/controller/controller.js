class Controller {
  constructor() {
    // PROGRESSBAR VIEW (start loading...)
    this.progessBarView = new ProgressBarView()
    this.showProgressBar("primary","white","",true,1000)

    /* MODEL */
    this._createModel()

    /* VIEW */
    // HEADER
    this._createHeaderView()
    // EDITOR
    this._createEditorView()
    // FOOTER
    this._createFooterView()
    // SIDEBAR
    this._createSidebarView()
    // MYTTMODAL
    this._createMyTTModalView()
    // NEWPLANUNGSMODAL
    this._createNewPlanungModalView()
    // ABOUTMODAL
    this._createAboutModalView()
    // ALERT
    this.alertView = new AlertView()

    // Initial Display
    this.updateView()
  }

  /* CONSTRUCTORS */
  _createModel = () => {
    this.model = new Model()
    // Parser
    this.myTTParser = new MyTTParser()
    // Bind Model Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.model.bindFooterDataChanged(this.onFooterDataChanged)
    this.model.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.model.planung.bindHeaderDataChanged(this.onHeaderDataChanged)
    this.model.planung.bindErrorOccured(this.alertError)
  }

  _createHeaderView = () => {
    this.headerView = new HeaderView()
    this.headerView.bindClickOnReloadDataButon(this.handleClickOnReloadDataButton)
  }

  _createEditorView = () => {
    this.editorView = new EditorView()
    this.editorView.bindAddMannschaft(this.handleAddMannschaft)
    this.editorView.bindClickOnLadeAufstellungLink(this.handleClickOnLadeAufstellungLink)
    this.editorView.bindClickOnNeuePlanungButton(this.createNewPlanung)
    this.editorView.bindClickOnOeffnePlanungButton(this.handleClickOpenPlanungButton)
  }

  _createFooterView = () => {
    this.footerView = new FooterView()
    this.footerView.bindAddTagToPlanung(this.handleAddTagToPlanung)
  }

  _createSidebarView = () => {
    this.sidebarView = new SidebarView()
    // Handler SIDEBAR VIEW
    this.sidebarView.bindClickCloseButtonOnSidebar(this.handleClickCloseButtonOnSidebar)
    this.sidebarView.bindCompareHalbserienFn(this.model.planung.compareHalbserien)
    // Handler SIDEBAR SPIELER VIEW
    this.sidebarView.bindEditNameOnSpieler(this.handleEditNameOnSpieler)
    this.sidebarView.bindEditQttrOnSpieler(this.handleEditQttrOnSpieler)
    this.sidebarView.bindClickResButtonOnSpieler(this.handleClickResButtonOnSpieler)
    this.sidebarView.bindClickSbeButtonOnSpieler(this.handleClickSbeButtonOnSpieler)
    this.sidebarView.bindClickFarbeButtonOnSpieler(this.handleClickFarbeButtonOnSpieler)
    this.sidebarView.bindEditKommentarOnSpieler(this.handleEditKommentarOnSpieler)
    this.sidebarView.bindClickDeleteButtonOnSpieler(this.handleClickDeleteButtonOnSpieler)
    // Handler SIDEBAR MANNSCHAFT VIEW
    this.sidebarView.bindEditLigaOnMannschaft(this.handleEditLigaOnMannschaft)
    this.sidebarView.bindEditSollstaerkeOnMannschaft(this.handleEditSollstaerkeOnMannschaft)
    this.sidebarView.bindEditSpieltagOnMannschaft(this.handleEditSpieltagOnMannschaft)
    this.sidebarView.bindEditUhrzeitOnMannschaft(this.handleEditUhrzeitOnMannschaft)
    this.sidebarView.bindEditSpielwocheOnMannschaft(this.handleEditSpielwocheOnMannschaft)
    this.sidebarView.bindEditKommentarOnMannschaft(this.handleEditKommentarOnMannschaft)
    this.sidebarView.bindClickDeleteButtonOnMannschaft(this.handleClickDeleteButtonOnMannschaft)
  }

  _createMyTTModalView = () => {
    this.myTTModalView = new MyTTModalView()
    this.myTTModalView.bindHtmlParser("aufstellung", this.parseAufstellungHtml)
    this.myTTModalView.bindParseResultAnalyzer("aufstellung", this.getAufstellungsParseResult)
    this.myTTModalView.bindClickOnLoadButtonOnMyTTModalTab("aufstellung", this.handleClickAufstellungLadenButtonOnMyTTModal)
    this.myTTModalView.bindHtmlParser("ttrwerte", this.parseTtrRanglisteHtml)
    this.myTTModalView.bindParseResultAnalyzer("ttrwerte", this.getTtrRanglisteParseResult)
    this.myTTModalView.bindClickOnLoadButtonOnMyTTModalTab("ttrwerte", this.handleClickTTRWerteLadenButtonOnMyTTModal)
    this.myTTModalView.bindHtmlParser("bilanzen", this.parseBilanzenHtml)
    this.myTTModalView.bindParseResultAnalyzer("bilanzen", this.getBilanzenParseResult)
    this.myTTModalView.bindClickOnLoadButtonOnMyTTModalTab("bilanzen", this.handleClickBilanzenLadenButtonOnMyTTModal)
  }

  _createNewPlanungModalView = () => {
    this.newPlanungModalView = new NewPlanungModalView()
    this.newPlanungModalView.bindClickSubmitPlanungButton(this.handleClickSubmitPlanungButton)
  }

  _createAboutModalView = () => {
    this.aboutModalView = new AboutModalView()
  }

  /* UNDO + REDO */

  undo = () => {
    this.model.undo()
  }

  redo = () => {
    this.model.redo()
  }

  /* ABOUT MODAL */

  displayAboutModal = () => {
    this.aboutModalView.displayAboutModal()
  }

  /* PLANUNG */

  createNewPlanung = () => {
    // close current planung save
    this.closePlanungSave().then((result) => {
      if (result) {
        // Show Planungs Modal
        this.newPlanungModalView.displayPlanungModal()
      }
    })
  }

  saveFile = () => {
    const planung_json = JSON.parse(this.getPlanungAsJsonString())
    // set saved to true in the planung in the file
    planung_json.saved = true
    const planung_json_save_str = JSON.stringify(planung_json)
    var saveSuccess = false
    var filepath = planung_json.file
    if (filepath === "") {
      var filepath = saveAsDialog(planung_json)
    }
    if (filepath) {
      saveSuccess = writePlanungToFile(filepath, planung_json_save_str)
    }
    if (saveSuccess) {
      this.setPlanungFile(filepath)
    }
    return saveSuccess
  }

  closePlanungSave = () => {
    if ( ! this.model.planung.saved ) {
      // show confirm dialog if current planung is unsafed
      let confirmclosedialogresult = confirmClosePlanungDialog()
      switch (confirmclosedialogresult) {
        case 0 : // Speichern
          return new Promise((resolve, reject) => {
            var saveSuccess = this.saveFile()
            if ( saveSuccess ) {
              this.closePlanung()
            }
            resolve(saveSuccess)
          })
        case 1 : // Schließen
          return new Promise((resolve, reject) => {
            this.closePlanung()
            resolve(true)
          })
        case 2 : // Abbrechen
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      }
    }
    return new Promise((resolve, reject) => {
      this.closePlanung()
      resolve(true)
    })
  }

  closePlanung = () => {
    // New planung
    this.model.createNewPlanung()
    // reset local storage
    localStorage.removeItem('localStorageFilepath')
    localStorage.removeItem('localStoragePlanung')
    localStorage.removeItem('localStorageTags')
    // Bind Handlers
    this.model.bindSidebarViewChanged(this.onSidebarViewChanged)
    this.model.bindFooterDataChanged(this.onFooterDataChanged)
    this.model.planung.bindMannschaftenChanged(this.onMannschaftenChanged)
    this.model.planung.bindHeaderDataChanged(this.onHeaderDataChanged)
    this.model.planung.bindErrorOccured(this.alertError)
    // reset and hide Planungs Modal
    this.newPlanungModalView.destroyPlanungModal()
    this._createNewPlanungModalView()
    // reset and hide MyTT Modal
    this.myTTModalView.destroyMyTTModal()
    this._createMyTTModalView()
    // Initial Display
    this.updateView()
  }

  handleClickOpenPlanungButton = () => {
    ipcRenderer.invoke('openFile', 'Open a File')
  }

  getPlanungAsJsonString = () => {
    return this.model.planung.getPlanungAsJsonString()
  }

  openPlanung = (planung_json_string, filepath) => {
    try {
      this.model.updatePlanung(JSON.parse(planung_json_string), true)
      this.setPlanungFile(filepath) // unfortunately this leads to a new entry in the undo history
      this.model.resetUndoRedo() // reset the undo history
    } catch (e) {
      this.alertError(`Die geöffnete Datei ist beschädigt. Die Planung konnte nicht geladen werden!`)
    }
  }

  setPlanungFile = (filepath) => {
    this.model.planung.setFile(filepath)
  }

  _updateDocumentTitle = () => {
    const app_title = "Tischtennis Mannschafts Planer"
    const separator = this.model.planung.isNew ? "" : " - "
    const filename = this.model.planung.isNew ? "" : this.model.planung.filename !== "" ? this.model.planung.filename : "Unbenannt"
    const saved_indicator = this.model.planung.saved ? "" : "*"
    $(document).attr("title", `${app_title}${separator}${filename}${saved_indicator}`);
  }

  /* UPDATE */

  updateView = () => {
    this.onHeaderDataChanged(this.model.planung)
    this.onMannschaftenChanged(this.model.planung)
    this.onFooterDataChanged(this.model)
  }

  onHeaderDataChanged = (planung) => {
    this.headerView.updateHeader(planung)
    this.myTTModalView.setHomeUrl("aufstellung", planung.aufstellung.url)
    this.myTTModalView.setHomeUrl("ttrwerte", planung.ttrwerte.url)
    this.myTTModalView.setHomeUrl("bilanzen", planung.bilanzen.url)
    this._updateDocumentTitle()
  }

  onMannschaftenChanged = (planung) => {
    this.editorView.displayMannschaften(planung)
    this.editorView.bindClickOnMannschaft(this.handleClickOnMannschaft)
    this.editorView.bindAddSpieler(this.handleAddSpieler)
    this.editorView.bindClickOnSpieler(this.handleClickOnSpieler)
    this.editorView.bindToggleSpvOnSpieler(this.handleToggleSpvOnSpieler)
    this.editorView.bindReorderSpieler(this.handleReorderSpieler)
    this.editorView.bindReorderMannschaft(this.handleReorderMannschaft)
    this.myTTModalView.notifyPlanungUpdated()
    this.onSidebarViewChanged()
    ipcRenderer.send('enableFileMenu', !this.model.planung.isNew)
  }

  onSidebarViewChanged = () => {
    const display = this.model.view.sidebar.display 
    const id = this.model.view.sidebar.id
    if (display == "spieler") {
      const spieler = this.model.planung.spieler.getSpieler(id)
      this.sidebarView.displaySpieler(spieler)
      this.editorView.focusSpieler(spieler)
    } else if (display == "mannschaft") {
      const mannschaft = this.model.planung.mannschaften.getMannschaft(id)
      this.sidebarView.displayMannschaft(mannschaft)
      this.editorView.focusMannschaft(mannschaft)
    } else {
      this.sidebarView.hideSidebar()
      this.editorView.removeFocus()
    }
  }

  onFooterDataChanged = (model) => {
    this.footerView.update(model)
    this.planungTagsModalView.update(model)
  }

  alertError = (error="A internal Error occured") => {
    this.alert("danger", error, -1)
  }

  alert = (type="primary", html_content="", timeout=3000) => {
    this.alertView.displayAlert(type, html_content, timeout)
  }

  showProgressBar = (color="primary", textcolor="white", text="", fullscreen=false, timeout=-1) => {
    this.progessBarView.show(color, textcolor, text, fullscreen, timeout)
  }

  hideProgressBar = () => {
    this.progessBarView.hide()
  }

  /* HEADER HANDLER */

  handleClickOnReloadDataButton = (tab, url) => {
    this.myTTModalView.loadUrl(tab, url)
  }

  /* NEW PLANUNG MODAL HANDLER */
  handleClickSubmitPlanungButton = (planung_json) => {
    this.model.updatePlanung(planung_json, false)
    ipcRenderer.send('enableSaveExportPrintClose')
  }

  parseAufstellungUrl = (url) => {
    return this.myTTParser.parseMyTTAufstellungsUrl(url)
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
    return this.myTTParser.getResultOfMyTTAufstellungsParser(planung, this.model.planung)
  }

  getTtrRanglisteParseResult = (planung) => {
    return this.myTTParser.getResultOfMyTTTtrRanglisteParser(planung, this.model.planung)
  }

  getBilanzenParseResult = (planung) => {
    return this.myTTParser.getResultOfMyTTBilanzenParser(planung, this.model.planung)
  }

  handleClickAufstellungLadenButtonOnMyTTModal = (planung_json) => {
    // Hide the sidebar as the currently shown spieler/mannschaft might not be there after load
    this.model.closeSidebar()
    // load the aufstellung
    this.model.planung.loadFromJSON(planung_json, true)
    // Assume if we load the Aufstellung of a Serie, we want to start planning the next 
    // Load RR-2019/20 -> Plan VR-2020/21
    this.model.planung.increaseSerie()
  }

  handleClickTTRWerteLadenButtonOnMyTTModal = (planung_json) => {
    this.model.planung.loadFromJSON(planung_json)
  }

  handleClickBilanzenLadenButtonOnMyTTModal = (planung_json) => {
    this.model.planung.loadFromJSON(planung_json)
  }

  /* EDITOR HANDLER */

  handleClickOnLadeAufstellungLink = () => {
    this.myTTModalView.loadUrl('aufstellung', this.model.planung.aufstellung.url)
  }

  handleAddMannschaft = (nummer) => {
    this.model.addMannschaft(nummer)
  }

  handleAddSpieler = (spielklasse, mannschaft, position, name, qttr) => {
    /* The spielklasse can later be used to have more than one planungs-objcet */
    this.model.addSpieler(mannschaft, position, name, qttr)
  }

  handleReorderSpieler = (id, new_mannschaft, new_position) => {
    this.model.planung.reorderSpieler(id, new_mannschaft, new_position)
  }

  handleReorderMannschaft = (mannschaft, new_mannschaft) => {
    this.model.planung.reorderMannschaft(mannschaft, new_mannschaft)
  }

  handleClickOnSpieler = (id) => {
    this.model.displaySpielerDetails(id)
  }

  handleClickOnMannschaft = (id) => {
    this.model.displayMannschaftDetails(id)
  }

  handleToggleSpvOnSpieler = (id, spv) => {
    this.model.planung.editSpielerSpv(id, spv)
  }

  /* FOOTER HANDLER */

  handleAddTagToPlanung = (tag) => {
    this.model.addTagToPlanung(tag)
  }

  }

  /* SIDEBAR HANDLER */

  handleClickCloseButtonOnSidebar = () => {
    this.model.closeSidebar()
  }

  /* SIDEBAR SPIELER HANDLER */

  handleEditNameOnSpieler = (id, name) => {
    this.model.planung.editSpielerName(id, name)
  }

  handleEditQttrOnSpieler = (id, qttr) => {
    this.model.planung.editSpielerQttr(id, qttr)
  }

  handleClickResButtonOnSpieler = (id, res) => {
    this.model.planung.editSpielerRes(id, res)
  }

  handleClickSbeButtonOnSpieler = (id, sbe) => {
    this.model.planung.editSpielerSbe(id, sbe)
  }

  handleClickFarbeButtonOnSpieler = (id, farbe) => {
    this.model.planung.editSpielerFarbe(id, farbe)
  }

  handleEditKommentarOnSpieler = (id, kommentar) => {
    this.model.planung.editSpielerKommentar(id, kommentar)
  }

  handleClickDeleteButtonOnSpieler = (id) => {
    this.model.deleteSpieler(id)
  }

  /* SIDEBAR MANNSCHAFT HANDLER */

  handleEditLigaOnMannschaft = (id, liga) => {
    this.model.planung.editMannschaftLiga(id, liga)
  }

  handleEditSollstaerkeOnMannschaft = (id, sollstaerke) => {
    this.model.planung.editMannschaftSollstaerke(id, sollstaerke)
  }

  handleEditSpieltagOnMannschaft = (id, spieltag) => {
    this.model.planung.editMannschaftSpieltag(id, spieltag)
  }

  handleEditUhrzeitOnMannschaft = (id, uhrzeit) => {
    this.model.planung.editMannschaftUhrzeit(id, uhrzeit)
  }

  handleEditSpielwocheOnMannschaft = (id, spielwoche) => {
    this.model.planung.editMannschaftSpielwoche(id, spielwoche)
  }

  handleEditKommentarOnMannschaft = (id, kommentar) => {
    this.model.planung.editMannschaftKommentar(id, kommentar)
  }

  handleClickDeleteButtonOnMannschaft = (id, keep_spieler) => {
    this.model.deleteMannschaft(id, keep_spieler)
  }

}