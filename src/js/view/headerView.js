class HeaderView {
  constructor(planung) {
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
          <h4 id="planung-reload-data-button" class="link" data-toggle="modal" data-target="#planung-reload-data-modal">
            <i class="fa fa-cloud-download" data-toggle="tooltip" data-placement="bottom" data-html="true" title="Aktualisiere Daten<br/>von myTischtennis.de"></i>
          </h4>
          <span class="badge badge-dark p-1">CLICK-TT</span><sub><i class="fa fa-check-circle text-success overlay-icon"></i></sub>
          <span class="badge badge-dark p-1">11:9</span><sub><i class="fa fa-times-circle text-danger overlay-icon"></i></sub>
          <span class="badge badge-dark p-1">TTR</span><sub><i class="fa fa-warning text-warning overlay-icon"></i></sub>
        </div>
      </div>
    `)
    this.planung = planung
    this.mytt_aufstellung_url = planung.mytt.aufstellung.url
    this.reload_data_button = $("#planung-reload-data-button")
    this.reload_data_button.click( (event) => {
      $("#webview-url").val(this.mytt_aufstellung_url)
      const webview = $("#planung-reload-data-modal-aufstellungen-webview")
      if ( webview.attr("src") === "") {
        webview.attr("src", this.mytt_aufstellung_url)
      }
    })
  }

  updateHeader(planung) {
    this.planung = planung
    $('#planung-verein').text(planung.verein);
    $('#planung-verein').attr("title", `Vereins-Nr.: ${planung.vereinsNummer}`);
    $('#planung-verband').text(planung.verband);
    $('#planung-serie').text(planung.halbserie + " " + planung.saison);
    $('#planung-spielklasse').text(planung.spielklasse);
    //$('#planung-qttrdatum').text("QTTR: " + planung.qttrDatum);
  }
}