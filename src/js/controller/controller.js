class Controller {
  constructor(model, headerView, editorView, sidebarView) {
    this.model = model
    this.headerView = headerView
    this.editorView = editorView
    this.sidebarView = sidebarView

    // Initial Display of Header Data
    this.onHeaderDataChanged(this.model.planung)

    // Initial Display of Mannschaften and Spieler
    this.onMannschaftenChanged(this.model.mannschaften, this.model.spieler)
  }

  onHeaderDataChanged = planung => {
    this.headerView.updateHeader(planung)
  }

  onMannschaftenChanged = (mannschaften,spieler) => {
    this.editorView.displayMannschaften(mannschaften,spieler)
  }
}