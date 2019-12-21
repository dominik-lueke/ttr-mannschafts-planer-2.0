class HeaderView {
  constructor() {
    // The header element
    $('#header').append(`
      <div class="d-flex bg-dark text-white text-center fixed-top">
        <div class="p-2 flex-fill text-muted">
          <h4><small id="planung-verein"></small></h4>
          <h6><small id="planung-vereinsnummer"></small></h6>
        </div>
        <div class="p-2 flex-fill">
          <h4 id="planung-serie"></h4>
          <h6 id="planung-spielklasse"></h6>
        </div>
        <div class="p-2 flex-fill text-muted">
          <h4><small id="planung-qttrdatum"></small></h4>
          <i class="fa fa-refresh" data-toggle="tooltip" data-placement="bottom" data-html="true" title="Aktualisiere TTR-Werte<br/>von myTischtennis.de"></i>
        </div>
      </div>
    `)
  }

  updateHeader(planung) {
    $('#planung-verein').text(planung.verein);
    $('#planung-vereinsnummer').text("Vereins-Nr.:" + planung.vereinsNummer);
    $('#planung-serie').text(planung.halbserie + " " + planung.saison);
    $('#planung-spielklasse').text(planung.spielklasse);
    $('#planung-qttrdatum').text("QTTR: " + planung.qttrDatum);
  }
}