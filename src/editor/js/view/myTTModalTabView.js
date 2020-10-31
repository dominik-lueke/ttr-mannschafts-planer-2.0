class MyTTModalTabView {
  constructor(container, id) {
    container.find("ul.nav").append(`
      <li class="nav-item pl-1">
        <a class="nav-link" id="myttmodal-${id}-tab" href="#myttmodal-${id}-pane" data-toggle="tab" role="tab" aria-controls="myttmodal-${id}-tab" aria-selected="true">${id}</a>
      </li>
    `)
    container.find("div.tab-content").append(`
      <div class="tab-pane fade" id="myttmodal-${id}-pane" role="tabpanel" aria-labelledby="${id}-pane">
        <div class="input-group mt-2 mb-2">
          <div class="input-group-prepend">
            <span class="input-group-text text-muted myttmodal-home-button" id="myttmodal-${id}-webview-home-button">
              <i class="fa fa-home"></i>
            </span>
          </div>
          <input id="myttmodal-${id}-webview-url-input" type="url" pattern="https?://.+" class="form-control form-control-sm"></input>
          <div class="input-group-append">
            <span class="input-group-text text-muted myttmodal-loading-indicator" id="myttmodal-${id}-webview-loading-indicator"></span>
          </div>
        </div>
        <!-- preload path relative to ./src/editor/html/editor.html -->
        <webview id="myttmodal-${id}-webview" style="height: calc(85vh - 16em)" src="" preload="./../js/injection/inject.js">
        </webview>
        <div class="container">
          <div class="row text-muted">
            <p id="myttmodal-${id}-status" class="myttmodal-status ml-2">
            </p>
          </div>
          <div class="row">
            <div class="col-sm">
              <span class="d-inline pull-right" id="myttmodal-${id}-load-button-popover-container" >
                <button id="myttmodal-${id}-load-button" type="button" class="btn btn-success pull-right myttmodal-load-button" disabled >${id} laden</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    `)
    this.id = id
    // cache jq elements
    this.modal = $("#planung-reload-data-modal")
    this.tab = $(`#myttmodal-${id}-tab`)
    this.webview = document.querySelector(`#myttmodal-${id}-webview`)
    this.loading_indicator = $(`#myttmodal-${id}-webview-loading-indicator`)
    this.url_input = $(`#myttmodal-${id}-webview-url-input`)
    this.home_button = $(`#myttmodal-${id}-webview-home-button`)
    this.refresh_button = this.loading_indicator
    this.load_button = $(`#myttmodal-${id}-load-button`)
    this.load_button_popover = $(`#myttmodal-${id}-load-button-popover-container`)
    this.status_row = $(`#myttmodal-${id}-status`)
    // properties
    this.planung = {}
    this.parse_result = {}
    this.home_url = ""
    // functions
    this.parseHtml = {}
    this.getParseResult = {}
    // webview event listener
    this.webview.addEventListener('did-start-loading', () => { 
      this.loading_indicator.html('<i class="fa fa-circle-o-notch fa-spin"></i>')
      this.loading_indicator.attr("title","")
    } )
    this.webview.addEventListener('did-stop-loading', () => { 
      this.loading_indicator.html('<i class="fa fa-refresh"></i>')
      this.loading_indicator.attr("title", "Neu laden")
      this.url_input.val( this.webview.getURL() )
      // try to load again more time if the planung has not been recieved e.g because the webview waits for ajax calls
      setTimeout( () => {
        if ( "ttrrangliste_still_loading" in this.planung ) {
          this.url_input.val( this.webview.getURL() )
          this.webview.send("getHtml")
        }
      }, 1000)

    })
    this.webview.addEventListener('dom-ready', () => {
      this.url_input.val( this.webview.getURL() )
      this.webview.send("getHtml")
    } )
    this.webview.addEventListener('ipc-message', (event) => {
      this.planung = this.parseHtml(this.webview.getURL(), event.channel);
      this._displayParseResult()
    });
    // webview url controls
    this.home_button.click( (event) => {
      this.loadUrl(this.home_url, true)
    })
    this.refresh_button.click( (event) => {
      if (this.refresh_button.find(".fa-refresh").length == 1) {
        this.loadUrl(this.webview.getAttribute("src"), true)
      }
    })
    this.url_input.on("keyup", (event) => { 
      event.preventDefault()
      // On <Enter> we edit qttr
      if (event.keyCode === 13) {
        this.loadUrl(this.url_input.val(), false)
        this.url_input.blur()
      }
    })
    //tab activation
    this.tab.on('shown.bs.tab', (event) => {
      if (this.webview.getAttribute("src") == "" && this.home_url) {
        this.loadUrl(this.home_url)
      }
    })
  }

  bindHtmlParser(parser) {
    this.parseHtml = parser
  }

  bindParseResultAnalyzer(analyzer) {
    this.getParseResult = analyzer
  }

  bindClickOnLoadButtonOnMyTTModalTab(handler) {
    this.load_button.click((event) => { 
      this.load_button_popover.popover('dispose')
      this._loadData(handler) 
    })
  }

  show() {
    this.tab.tab('show')
  }

  setHomeUrl(url) {
    this.home_url = url
    this.home_button.attr("title", this.home_url)
  }

  loadUrl(url, reload=false) {
    if ( this.webview.getAttribute("src") !== url || reload ) {
      this.url_input.val(url)
      this.webview.setAttribute("src", url)
      this.load_button.prop("disabled", true)
      this.status_row.html(`<small>Suche ${this.id}</small> <div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Lade Informationen...</span></div>`)
    }
  }

  notifyPlanungUpdated() {
    if (Object.entries(this.planung).length > 0) {
      this._displayParseResult()
    }
  }

  _loadData(handler) {
    this.load_button.html('<i class="fa fa-circle-o-notch fa-spin"></i>')
    setTimeout( () => {
      handler(this.planung)
      this.load_button.html(`Lade ${this.id}`)
      this.modal.modal('hide')
    }, 1000)
  }

  _displayParseResult() {
    this.parse_result = this.getParseResult(this.planung)
    this.status_row.html(`<small>${this.parse_result.html}</small>`)
    // enable/disable button
    if ( this.parse_result.result ) {
      this.load_button.removeProp("disabled")
      this.load_button.attr("style", "")
    } else {
      this.load_button.prop("disabled", true)
      this.load_button.attr("style", "pointer-events: none;")
    }
    // Add popover to button if we are about to change the planungs details with 'Aufstellung laden'
    this.load_button_popover.popover('dispose')
    if ( this.parse_result.popoverhtml ) {
      this.load_button_popover.popover({
        trigger: 'hover',
        content: this.parse_result.popoverhtml,
        html: true,
        placement: 'top',
        template: '<div class="popover myttmodal-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
      })
    }

  }
}