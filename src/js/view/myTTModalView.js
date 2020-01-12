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
            <div class="modal-body">
              <div class="container mb-2">
                <div class="row">
                  <div class="col-sm-1">
                    <span class="text-muted" id="webview-home-button">
                      <i class="fa fa-2x fa-home"></i>
                    </span>
                  </div>
                  <div class="col-sm-10 pr-0">
                      <input id="webview-url" type="text" class="form-control form-control-sm"></input>
                  </div>
                  <div class="col-sm-1 pt-1 ">
                    <span class="text-muted pt-1" id="webview-loading-indicator"></span>
                  </div>
                </div>
              </div>
              <webview id="planung-reload-data-modal-aufstellungen-webview" style="height: calc(100% - 9em)" src="" preload="./src/js/injection/inject.js">
              </webview>
              <div class="container">
                <div class="row text-muted">
                  <p id="planung-status-row" class="ml-2">
                  </p>
                </div>
                <div class="row">
                  <div class="col-sm">
                    <button id="planung-reload-data-modal-aufstellungen-load-button" type="button" class="btn btn-success pull-right" disabled >Aufstellung laden</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    // cache jq elements
    this.modal = $("#planung-reload-data-modal")
    const webview = document.querySelector('webview')
    this.loading_indicator = $("#webview-loading-indicator")
    this.url_input = $("#webview-url")
    this.lade_aufstellung_button = $("#planung-reload-data-modal-aufstellungen-load-button")
    // properties
    this.planung = {}
    // functions
    this.parseAufstellungsHtml = {}
    // webview event listener
    webview.addEventListener('did-start-loading', () => { 
      //$("#planung-status-row").html(`<small>Lade Informationen</small> <div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Lade Informationen...</span></div`)
      this.lade_aufstellung_button.prop("disabled", true)
      this.loading_indicator.html('<i class="fa fa-circle-o-notch fa-spin"></i>')
    } )
    webview.addEventListener('did-stop-loading', () => { 
      this.loading_indicator.html('<i class="fa fa-refresh"></i>')
      this.url_input.val( webview.getURL() )
    })
    webview.addEventListener("dom-ready", () => {
      this.url_input.val( webview.getURL() )
      webview.send("getHtml")
    } )
    webview.addEventListener('ipc-message', (event) => {
      // Process the data from the webview
      $("#planung-status-row").html(`<small>Suche nach einer Aufstellung</small> <div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Lade Informationen...</span></div`)
      setTimeout( () => {
        this.planung = this.parseAufstellungsHtml(webview.getURL(), event.channel);
        if ( this.displayWebviewStatus() ){
          this.lade_aufstellung_button.removeProp("disabled")
        } else {
          this.lade_aufstellung_button.prop("disabled", true)
        }
      }, 1000)
    });
  }

  bindAufstellungsHtmlParser(parser) {
    this.parseAufstellungsHtml = parser
  }

  bindClickLadeAufstellungOnMyTTModal(handler) {
    this.lade_aufstellung_button.click((event) => { this._ladeAufstellung(handler) })
  }

  _ladeAufstellung(handler) {
    this.lade_aufstellung_button.html('<i class="fa fa-circle-o-notch fa-spin"></i>')
    setTimeout( () => {
      handler(this.planung)
      this.lade_aufstellung_button.html('Lade Aufstellung')
      this.modal.modal('hide')
    }, 1000)
  }

  displayWebviewStatus(){
    var aufstellungFound = true
    var statusHtml = ""
    // verein + + vereinsNummer + verband
    if ("verein" in this.planung && "vereinsNummer" in this.planung && "verband" in this.planung) {
      statusHtml += `${this.planung.verein} (${this.planung.vereinsNummer} - ${this.planung.verband}) ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Kein Verein gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    // saison
    if ("saison" in this.planung && "halbserie" in this.planung) {
      statusHtml += `${this.planung.halbserie} ${this.planung.saison} ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Saison gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    // spielklasse
    if ("spielklasse" in this.planung){
      statusHtml += `${this.planung.spielklasse} ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Spielklasse gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    statusHtml += "<br/>"
    // mannschaften
    if (this.planung.mannschaften.liste.length > 0) {
      statusHtml += `${this.planung.mannschaften.liste.length} Mannschaften gefunden ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Mannschaften gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    // spieler
    if (this.planung.spieler.liste.length > 0) {
      statusHtml += `${this.planung.spieler.liste.length} Spieler gefunden ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Spieler gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    $("#planung-status-row").html(`<small>${statusHtml}</small>`)
    return aufstellungFound
  }

  _getStatusIcon(positive) {
    const icon = positive ? "check" : "times"
    const color = positive ? "success" : "danger"
    return `<i class="fa fa-${icon} text-${color}"></i>`
  }
}