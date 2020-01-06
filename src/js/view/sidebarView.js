class SidebarView {
  constructor() {
    this.sidebar_div = $("#sidebar")
    this.sidebar_div.addClass("details-sidebar")
    this.spielerDetailsView = new SpielerDetailsView(this.sidebar_div)
    this.mannschaftDetailsView = new MannschaftDetailsView(this.sidebar_div)
  }

  bindClickCloseButtonOnSidebar(handler){
    this.spielerDetailsView.bindClickCloseButtonOnSidebar(handler)
    //this.mannschaftDetailsView.bindClickCloseButtonOnSidebar(handler)
  }

  bindEditQttrOnSpieler(handler) {
    this.spielerDetailsView.bindEditQttrOnSpieler(handler)
  }

  displaySpieler(spieler){
    this.mannschaftDetailsView.hide()
    this.spielerDetailsView.displaySpieler(spieler)
  }

  hideSidebar(){
    this.mannschaftDetailsView.hide()
    this.spielerDetailsView.hide()
  }
}