class AboutModalView {

  constructor() {
    this.json = {}
    $.getJSON("./../../../package.json", (json) => {
      this.json = json
      $("#aboutModal").append(this._getHtml())
    })
    
  }

  displayAboutModal() {
    $('.modal.show').modal('hide')
    $('#tischtennis-planer-about-modal').modal('show')
  }

  /* PRIVATE */
  _getHtml() {
    return `
    <div class="modal fade" id="tischtennis-planer-about-modal" tabindex="-1" role="dialog" aria-labelledby="tischtennis-planer-about-modal-label" aria-hidden="true" data-backdrop="static">
      <div class="modal-dialog bg-dark text-white" role="document">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h3 class="modal-title" style="font-weight:300;" id="tischtennis-planer-about-modal-label">Tischtennis Mannschafts Planer</h4>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <p>
              Der <b>Tischtennis Mannschafts Planer</b> ist ein freies <small><i class="fa fa-heart text-danger"></i></small> und quelloffenes Tool, um Aufstellungen für Tischtennis Mannschaften zu erstellen.
            </p>
            <p>
              Dieses Tool bietet eine Unterstützung zur Erstellung von ${DEFAULT_VERBAND}-Wettspielordnungs-konformen Aufstellungen in Bezug auf Spielstärke-Reihenfolge nach QTTR-Werten und Mannschafts-Sollstärken (<a href="file://assets/WO2020-01-01.pdf" class="text-success">Stand 01/2020</a>, Abschnitt H).
            </p>
            <p>
              Es garantiert allerdings nicht, dass die mit diesem Tool erstellten Aufstellungen vollständig WO-konform sind. Bitte überprüfe die erstellten Aufstellung stets noch einmal auf Richtigkeit. Einige Sonderstatus wie z.B. Jugend-Ersatzspieler oder gleichgestellte Ausländer werden nicht berücksichtigt.
            </p>
            <p>
              Die Aufstellungen vergangener Halbserien, TTR-Werte und Bilanzen können manuell von den <a href="https://mytischtennis.de" class="text-success">myTischtennis.de</a> Seiten heruntergeladen werden. Für die eingebetteten Inhalte von myTischtennis.de wird keine Haftung übernommen. Für einige Funktionen ist ein Account bei myTischtennis.de notwendig.
            </p>
            <hr class="border-white">
            <p>
              Autor: ${this.json.author}<br/>
              Email: ${this.json.email}<br/>
              Version: ${this.json.version}<br/>
              Lizenz: ${this.json.license}<br/>
              Repository: <a class="text-white" href="${this.json.repository}">${this.json.repository}</a>
            </p>
            <hr class="border-white">
            <p>
              <small>Built with 
                <a href="https://www.electronjs.org">Electron ${this.json.devDependencies.electron}</a>,
                <a href="https://getbootstrap.com/docs/4.4/getting-started/introduction/">Bootstrap ${this.json.vendor.bootstrap}</a>,
                <a href="https://fontawesome.com/v4.7.0/icons/">Font Awesome ${this.json.vendor.fontawesome}</a>,
                <a href="https://jquery.com/">jQuery ${this.json.vendor.jquery}</a>,
                <a href="https://jqueryui.com/">jQueryUI ${this.json.vendor.jqueryui}</a>, and
                <a href="https://popper.js.org/">popper.js ${this.json.vendor.popperjs}</a>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  `}
}