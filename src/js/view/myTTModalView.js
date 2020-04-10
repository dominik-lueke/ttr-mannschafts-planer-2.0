class MyTTModalView {

  constructor() {
    $("#myTTModal").append(`
      <div class="modal fade" id="planung-reload-data-modal" tabindex="-1" role="dialog" aria-labelledby="planung-reload-data-modal-label" aria-hidden="true" data-backdrop="static" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="planung-reload-data-modal-label">Lade Daten von myTischtennis.de</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div id="myttmodal-tab-container" class="modal-body">
              <ul class="nav nav-tabs" role="tablist">
              </ul>
              <div class="tab-content">
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    // cache jq elements
    this.tab_container = $("#myttmodal-tab-container")
    this.tabs = {
      "aufstellung": new MyTTModalTabView(this.tab_container, "Aufstellung", true),
      "ttrwerte": new MyTTModalTabView(this.tab_container, "TTR-Werte"),
      "bilanzen": new MyTTModalTabView(this.tab_container, "Bilanzen")
    }
    this.tabs["aufstellung"].show()
  }

  loadUrl(id, url) {
    if (id in this.tabs) {
      this.tabs[id].show()
      this.tabs[id].loadUrl(url)
    }
  }

  setHomeUrl(id, url) {
    if (id in this.tabs) {
      this.tabs[id].setHomeUrl(url)
    }
  }

  bindHtmlParser(id, parser) {
    if (id in this.tabs) {
      this.tabs[id].bindHtmlParser(parser)
    }
  }

  bindParseResultAnalyzer(id, analyzer) {
    if (id in this.tabs) {
      this.tabs[id].bindParseResultAnalyzer(analyzer)
    }
  }

  bindClickOnLoadButtonOnMyTTModalTab(id, handler) {
    if (id in this.tabs) {
      this.tabs[id].bindClickOnLoadButtonOnMyTTModalTab(handler)
    }
  }

}