class HeaderView {
  constructor() {
    // The header element
    $('#header').append(`
      <div class="d-flex bg-dark text-white text-center fixed-top">
        <div class="p-2 flex-fill">
          <h4><small id="planung-verein" data-toggle="tooltip" data-placement="bottom" data-html="true" title=""></small></h4>
          <h6><small id="planung-verband"></small></h6>
        </div>
        <div class="p-2 flex-fill">
          <h4 id="planung-serie"></h4>
          <h6 id="planung-spielklasse"></h6>
        </div>
        <div class="p-2 flex-fill">
          <h4><small id="planung-qttrdatum"></small></h4>
          <span id="planung-reload-data-button" class="link" data-toggle="modal" data-target="#planung-reload-data-modal">
            <i class="fa fa-refresh" data-toggle="tooltip" data-placement="bottom" data-html="true" title="Aktualisiere Daten<br/>von myTischtennis.de"></i>
          <span>
        </div>
      </div>
      <div class="modal fade" id="planung-reload-data-modal" tabindex="-1" role="dialog" aria-labelledby="planung-reload-data-modal-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="planung-reload-data-modal-label">Aktualisiere Daten von myTischtennis.de</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <webview id="planung-reload-data-modal-aufstellungen-webview" style="height: 100%" src="">
              </webview>
              
            </div>
            <div class="modal-footer">
              <span class="indicator"></span>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `)
    this.reload_data_button = $("#planung-reload-data-button")
    this.reload_data_button.click( (event) => {
      $("#planung-reload-data-modal-aufstellungen-webview").attr("src",
        "https://www.mytischtennis.de/clicktt/WTTV/19-20/verein/187012/TuRa-Elsen/mannschaftsmeldungendetails/H/vr/")
        })

    const webview = document.querySelector('webview')
    const indicator = document.querySelector('.indicator')

    const loadstart = () => {
      indicator.innerText = 'loading...'
    }

    const loadstop = () => {
      indicator.innerText = ''
      webview.downloadURL("https://www.mytischtennis.de/clicktt/WTTV/19-20/verein/187012/TuRa-Elsen/mannschaftsmeldungendetails/H/vr/")
    }

    webview.addEventListener('did-start-loading', loadstart)
    webview.addEventListener('did-stop-loading', loadstop)
    

  }

  updateHeader(planung) {
    $('#planung-verein').text(planung.verein);
    $('#planung-verein').attr("title", `Vereins-Nr.: ${planung.vereinsNummer}`);
    $('#planung-verband').text(planung.verband);
    $('#planung-serie').text(planung.halbserie + " " + planung.saison);
    $('#planung-spielklasse').text(planung.spielklasse);
    $('#planung-qttrdatum').text("QTTR: " + planung.qttrDatum);
  }
}