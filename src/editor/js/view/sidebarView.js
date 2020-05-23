class SidebarView {
  constructor() {
    this.sidebar_div = $("#sidebar")
    this.sidebar_div.addClass("details-sidebar")
    this.sidebar_div.addClass("display-none")
    this.spielerDetailsView = new SpielerDetailsView(this.sidebar_div)
    this.mannschaftDetailsView = new MannschaftDetailsView(this.sidebar_div)
    this.compareHalbserienFn = {}
  }

  bindClickCloseButtonOnSidebar(handler){
    this.spielerDetailsView.bindClickCloseButtonOnSidebar(handler)
    this.mannschaftDetailsView.bindClickCloseButtonOnSidebar(handler)
  }

  bindCompareHalbserienFn(compareFn){
    this.compareHalbserienFn = compareFn
  }

  /* DISPLAY */

  displaySpieler(spieler){
    this.sidebar_div.removeClass("display-none")
    this.mannschaftDetailsView.hide()
    this.spielerDetailsView.displaySpieler(spieler, this.compareHalbserienFn)
  }

  displayMannschaft(mannschaft){
    this.sidebar_div.removeClass("display-none")
    this.spielerDetailsView.hide()
    this.mannschaftDetailsView.displayMannschaft(mannschaft,  this.compareHalbserienFn)
  }

  /* HIDE */

  hideSidebar(){
    this.sidebar_div.addClass("display-none")
    this.mannschaftDetailsView.hide()
    this.spielerDetailsView.hide()
  }

  /* EDIT SPIELER */

  bindEditNameOnSpieler(handler) {
    this.spielerDetailsView.bindEditNameOnSpieler(handler)
  }

  bindEditQttrOnSpieler(handler) {
    this.spielerDetailsView.bindEditQttrOnSpieler(handler)
  }

  bindEditGeburtsdatumOnSpieler(handler) {
    this.spielerDetailsView.bindEditGeburtsdatumOnSpieler(handler)
  }

  bindClickResButtonOnSpieler(handler){
    this.spielerDetailsView.bindClickResButtonOnSpieler(handler)
  }

  bindClickSbeButtonOnSpieler(handler){
    this.spielerDetailsView.bindClickSbeButtonOnSpieler(handler)
  }

  bindClickFarbeButtonOnSpieler(handler) {
    this.spielerDetailsView.bindClickFarbeButtonOnSpieler(handler)
  }

  bindEditKommentarOnSpieler(handler) {
    this.spielerDetailsView.bindEditKommentarOnSpieler(handler)
  }

  bindClickDeleteButtonOnSpieler(handler) {
    this.spielerDetailsView.bindClickDeleteButtonOnSpieler(handler)
  }

  /* EDIT MANNSCHAFT */

  bindEditLigaOnMannschaft(handler) {
    this.mannschaftDetailsView.bindEditLigaOnMannschaft(handler)
  }

  bindEditSollstaerkeOnMannschaft(handler) {
    this.mannschaftDetailsView.bindEditSollstaerkeOnMannschaft(handler)
  }

  bindEditSpieltagOnMannschaft(handler) {
    this.mannschaftDetailsView.bindEditSpieltagOnMannschaft(handler)
  }

  bindEditUhrzeitOnMannschaft(handler) {
    this.mannschaftDetailsView.bindEditUhrzeitOnMannschaft(handler)
  }

  bindEditSpielwocheOnMannschaft(handler) {
    this.mannschaftDetailsView.bindEditSpielwocheOnMannschaft(handler)
  }

  bindEditKommentarOnMannschaft(handler) {
    this.mannschaftDetailsView.bindEditKommentarOnMannschaft(handler)
  }

  bindClickDeleteButtonOnMannschaft(handler) {
    this.mannschaftDetailsView.bindClickDeleteButtonOnMannschaft(handler)
  }

}