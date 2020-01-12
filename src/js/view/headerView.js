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
          <h4 id="planung-reload-data-button" class="link" data-toggle="modal" data-target="#planung-reload-data-modal">
            <i class="fa fa-cloud-download" data-toggle="tooltip" data-placement="bottom" data-html="true" title="Aktualisiere Daten<br/>von myTischtennis.de"></i>
          </h4>
          <div id="header-aufstellung-status-icon" data-toggle="tooltip" data-placement="bottom" data-html="true" title="">
            <span class="badge badge-dark p-1 text-muted">CLICK-TT</span>
            <sub><i class="fa fa-times-circle text-muted overlay-icon"></i></sub>
          </div>
          <!--
          <span class="badge badge-dark p-1">11:9</span><sub><i class="fa fa-times-circle text-danger overlay-icon"></i></sub>
          <span class="badge badge-dark p-1">TTR</span><sub><i class="fa fa-warning text-warning overlay-icon"></i></sub>
          -->
          </div>
      </div>
    `)
    this.planung = {}
    this.mytt_aufstellung_url = ""
    this.reload_data_button = $("#planung-reload-data-button")
    this.aufstellung_status_div = $("#header-aufstellung-status-icon")
    this.aufstellung_status_div_badge = this.aufstellung_status_div.find(".badge")
    this.aufstellung_status_div_icon = this.aufstellung_status_div.find("i")
    this.reload_data_button.click( (event) => {
      $("#webview-url").val(this.mytt_aufstellung_url)
      const webview = $("#planung-reload-data-modal-aufstellungen-webview")
      if ( webview.attr("src") !== this.mytt_aufstellung_url ) {
        webview.attr("src", this.mytt_aufstellung_url)
      }
    })
  }

  updateHeader(planung) {
    this.planung = planung
    this.mytt_aufstellung_url = planung.mytt.aufstellung.url
    $('#planung-verein').text(planung.verein);
    $('#planung-verein').attr("title", `Vereins-Nr.: ${planung.vereinsNummer}`);
    $('#planung-verband').text(planung.verband);
    $('#planung-serie').text(planung.halbserie + " " + planung.saison);
    $('#planung-spielklasse').text(planung.spielklasse);
    this._updateMyTTStatusIcons()
  }

  _updateMyTTStatusIcons() {
    switch (this.planung.mytt.aufstellung.status) {
      case "offline":
        this.aufstellung_status_div_badge.addClass("text-muted")
        this.aufstellung_status_div_icon.addClass("fa-times-circle").removeClass("fa-check-circle").removeClass("fa-warning")
        this.aufstellung_status_div_icon.addClass("text-muted").removeClass("text-success").removeClass("text-warning")
        this.aufstellung_status_div.attr("title", "Es wurde keine Aufstellung von myTischtennis geladen")
        break
      case "ok":
        this.aufstellung_status_div_badge.removeClass("text-muted")
        this.aufstellung_status_div_icon.removeClass("fa-times-circle").addClass("fa-check-circle").removeClass("fa-warning")
        this.aufstellung_status_div_icon.removeClass("text-muted").addClass("text-success").removeClass("text-warning")
        this.aufstellung_status_div.attr("title", "Die Aufstellung der letzten Halbserie wurde von myTischtennis geladen")
        break
      case "outdated":
        this.aufstellung_status_div_badge.removeClass("text-muted")
        this.aufstellung_status_div_icon.removeClass("fa-times-circle").removeClass("fa-check-circle").addClass("fa-warning")
        this.aufstellung_status_div_icon.removeClass("text-muted").removeClass("text-success").addClass("text-warning")
        this.aufstellung_status_div.attr("title", "Die von myTischtennis geladene Aufstellung liegt über eine Halbserie zurück")
        break
      default:
        break
    }
    // activate tooltips
    this.aufstellung_status_div.tooltip('dispose')
    this.aufstellung_status_div.tooltip()
  }
}