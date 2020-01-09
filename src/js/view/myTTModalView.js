class MyTTModalView {

  constructor() {
    $("#myTTModal").append(`
      <div class="modal fade" id="planung-reload-data-modal" tabindex="-1" role="dialog" aria-labelledby="planung-reload-data-modal-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="planung-reload-data-modal-label">Lade Daten von myTischtennis.de</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <webview id="planung-reload-data-modal-aufstellungen-webview" style="height: calc(100% - 7em)" src="" preload="./src/js/injection/inject.js">
              </webview>
              <div class="container">
                <div class="row text-muted">
                  <p class="ml-2">
                    <small id="planung-reload-data-modal-aufstellungen-verein"><span></span> <i class="fa"></i></small>
                    <small id="planung-reload-data-modal-aufstellungen-serie"><span></span> <i class="fa"></i></small>
                    <small id="planung-reload-data-modal-aufstellungen-spielklasse"><span></span> <i class="fa"></i></small><br/>
                    <small id="planung-reload-data-modal-aufstellungen-mannschaften"><span ></span> <i class="fa"></i></small>
                    <small id="planung-reload-data-modal-aufstellungen-spieler"><span></span> <i class="fa"></i></small>
                  </p>
                </div>
                <div class="row">
                  <div class="col-sm">
                    <button id="planung-reload-data-modal-aufstellungen-load-button" type="button" class="btn btn-success pull-right" disabled >Aufstellung laden</button>
                    <span class="indicator pull-right p-2 mr-2"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    // cache jq elements
    const webview = document.querySelector('webview')
    this.lade_aufstellung_button = $("#planung-reload-data-modal-aufstellungen-load-button")
    webview.addEventListener('did-start-loading', () => { this.lade_aufstellung_button.html('<i class="fa fa-circle-o-notch fa-spin"></i>') } )
    webview.addEventListener('did-stop-loading', () => { this.lade_aufstellung_button.html('Aufstellung laden') } )
    webview.addEventListener("dom-ready", () => { webview.send("getHtml") } )
    // Process the data from the webview
    webview.addEventListener('ipc-message', (event) => {
      this.aufstellung_html_body = event.channel
      this.lade_aufstellung_button.html('Aufstellung laden')
      if ( this._parseHtmlBodyForAufstellung(this.aufstellung_html_body, webview) ){
        $("#planung-reload-data-modal-aufstellungen-load-button").removeProp("disabled")
      } else {
        $("#planung-reload-data-modal-aufstellungen-load-button").prop("disabled", true)
      }
      //this.aufstellungWebviewHtmlHandler(html);
    });
    this.aufstellungstable_html = ""
    this.planung = {
      verein: "",
      vereinsNummer: "",
      verband: "",
      saison: "",
      halbserie: "",
      spielklasse: "",
    }
  }

  // bindHandleAufstellungWebviewHtmlRecieved(handler) {
  //   this.aufstellungWebviewHtmlHandler = handler
  // }

  bindClickLadeAufstellungOnMyTTModal(handler) {
    this.lade_aufstellung_button.click((event) => { this._ladeAufstellung(handler) })
  }

  _ladeAufstellung(handler) {
    handler(this.aufstellungstable_html, this.planung)
  }

  _parseHtmlBodyForAufstellung(html_body, webview){
    var aufstellungFound = true

    /* First Processing of result */
    var el = $('<div></div>');
    el.html(`<html><head><title>titleTest</title></head><body>${html_body}</body></html>`);

    // serie + verband
    const url_split = webview.getURL().split("/") 
    // Expect like "https://www.mytischtennis.de/clicktt/WTTV/19-20/verein/187012/TuRa-Elsen/mannschaftsmeldungendetails/H/vr/"
    // url_split = [https:,,www.mytischtennis.de,clicktt,WTTV,19-20,verein,187012,TuRa-Elsen,mannschaftsmeldungendetails,H,vr,]
    var saison = ""
    var halbserie = ""
    var verband = ""
    if (url_split.length == 13){
      // saison
      if ( (url_split[5]).match(/\d\d-\d\d/g) !== null ) {
        saison = "20" + url_split[5].replace("-","/")
      }
      // serie
      halbserie = url_split[11].replace("rr", "Rückrunde").replace("vr","Vorrunde")
      // verband
      verband = url_split[4]
    }
    if (saison !== "" && (halbserie == "Vorrunde" || halbserie == "Rückrunde")) {
      this.planung.saison = saison
      this.planung.halbserie = halbserie
      $("#planung-reload-data-modal-aufstellungen-serie span").text(halbserie + " " + saison)
      $("#planung-reload-data-modal-aufstellungen-serie i").addClass("fa-check").addClass("text-success").removeClass("fa-times").removeClass("text-danger")
    } else {
      this.planung.saison = ""
      this.planung.halbserie = ""
      $("#planung-reload-data-modal-aufstellungen-serie span").text("Keine Saison gefunden")
      $("#planung-reload-data-modal-aufstellungen-serie i").addClass("fa-times").addClass("text-danger").removeClass("fa-check").removeClass("text-success")
      aufstellungFound = false
    }
    
    // verein + spielklasse + vereinsNummer
    const verein_spielklasse = el.find(".panel-body > h3").first().text().split(", ") // "TuRa Elsen, Herren"
    const vereinsNummer = el.find(".panel-body > h5").first().text().split(", ")[0].split(": ")[1] // "VNr.: 187012, Gründungsjahr: 1947"
    if (verein_spielklasse.length == 2 && vereinsNummer.match(/\d\d\d\d\d\d/g) !== null && verband !== ""){
      this.planung.verein = verein_spielklasse[0]
      this.planung.vereinsNummer = vereinsNummer
      this.planung.verband = verband
      $("#planung-reload-data-modal-aufstellungen-verein span").text(`${this.planung.verein} (VNR.:${this.planung.vereinsNummer} - ${this.planung.verband})`)
      $("#planung-reload-data-modal-aufstellungen-verein i").addClass("fa-check").addClass("text-success").removeClass("fa-times").removeClass("text-danger")
      this.planung.spielklasse = verein_spielklasse[1]
      $("#planung-reload-data-modal-aufstellungen-spielklasse span").text(this.planung.spielklasse)
      $("#planung-reload-data-modal-aufstellungen-spielklasse i").addClass("fa-check").addClass("text-success").removeClass("fa-times").removeClass("text-danger")
    } else {
      this.planung.verein = ""
      $("#planung-reload-data-modal-aufstellungen-verein span").text("Kein Verein gefunden" )
      $("#planung-reload-data-modal-aufstellungen-verein i").addClass("fa-times").addClass("text-danger").removeClass("fa-check").removeClass("text-success")
      this.planung.spielklasse = ""
      $("#planung-reload-data-modal-aufstellungen-spielklasse span").text("Keine Spielklasse gefunden")
      $("#planung-reload-data-modal-aufstellungen-spielklasse i").addClass("fa-times").addClass("text-danger").removeClass("fa-check").removeClass("text-success")
      aufstellungFound = false
    }

    // mannschaften + spieler
    const aufstellungstable = el.find(".panel-body > table.table-mytt").first()
    const mannschaften = parseInt(aufstellungstable.find("tr").last().find("td").first().text().split(".")[0],10)
    const spieler = aufstellungstable.find("tr").length - mannschaften + 1
    if (aufstellungstable.length == 1 && ! Number.isNaN(mannschaften) && ! Number.isNaN(spieler) ) {
      this.aufstellungstable_html = "<table>" + aufstellungstable.html() + "</table>"
      $("#planung-reload-data-modal-aufstellungen-mannschaften span").text(mannschaften + " Mannschaften gefunden")
      $("#planung-reload-data-modal-aufstellungen-mannschaften i").addClass("fa-check").addClass("text-success").removeClass("fa-times").removeClass("text-danger")
      $("#planung-reload-data-modal-aufstellungen-spieler span").text(spieler + " Spieler gefunden")
      $("#planung-reload-data-modal-aufstellungen-spieler i").addClass("fa-check").addClass("text-success").removeClass("fa-times").removeClass("text-danger")
    } else {
      $("#planung-reload-data-modal-aufstellungen-mannschaften span").text("Keine Mannschaften gefunden")
      $("#planung-reload-data-modal-aufstellungen-mannschaften i").addClass("fa-times").addClass("text-danger").removeClass("fa-check").removeClass("text-success")
      $("#planung-reload-data-modal-aufstellungen-spieler span").text("Keine Spieler gefunden")
      $("#planung-reload-data-modal-aufstellungen-spieler i").addClass("fa-times").addClass("text-danger").removeClass("fa-check").removeClass("text-success")
      aufstellungFound = false
    }

    return aufstellungFound
  }
}