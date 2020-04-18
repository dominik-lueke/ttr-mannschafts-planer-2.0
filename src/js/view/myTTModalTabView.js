class MyTTModalTabView {
  constructor(container, id, current_planung) {
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
        <webview id="myttmodal-${id}-webview" style="height: calc(100% - 9em)" src="" preload="./src/js/injection/inject.js">
        </webview>
        <div class="container">
          <div class="row text-muted">
            <p id="myttmodal-${id}-status" class="myttmodal-status ml-2">
            </p>
          </div>
          <div class="row">
            <div class="col-sm">
              <button id="myttmodal-${id}-load-button" type="button" class="btn btn-success pull-right myttmodal-load-button" disabled >${id} laden</button>
            </div>
          </div>
        </div>
      </div>
    `)
    this.current_planung = current_planung
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
      this.parse_result = this.getParseResult(this.planung)
      this.status_row.html(`<small>${this.parse_result.html}</small>`)
      if ( this.parse_result.result ){
        this.load_button.removeProp("disabled")
        // Add popover to button if we are about to change the planungs details with 'Aufstellung laden'
        this.load_button.popover('dispose')
        if ( this.id === 'Aufstellung' ) {
          var planung_changed = false
          var planungs_difference_html = '<b><i class="fa fa-warning text-warning"></i> Achtung!</b> Die aktuelle Saisonplanung wird verändert.'
          const attributes = ['verein', 'spielklasse', 'saison']
          attributes.forEach( attribute => {
            var loaded_value = this.planung[attribute]
            var current_value = this.current_planung[attribute]
            if ( attribute === 'saison') {
              // special case for saison+halbserie where we load a saison+halbserie but the start planning the next one with it
              loaded_value = `${this.planung.halbserie} ${this.planung.saison}`
              current_value = `${this.current_planung._getOtherHalbserie()} ${this.current_planung._getPreviousSaison()}`
            }
            if ( loaded_value !== current_value) { 
              planung_changed = true
              planungs_difference_html += `<br/> ${current_value} &rarr; <b>${loaded_value}</b>`
            }
          })
          if ( planung_changed ){
            this.load_button.popover({
              trigger: 'hover',
              content: planungs_difference_html,
              html: true,
              placement: 'top'
            })
          }
        }
        
      } else {
        this.load_button.prop("disabled", true)
      }
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
      if (this.webview.getAttribute("src") == "") {
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
      this.load_button.popover('dispose')
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
    }
    this.load_button.prop("disabled", true)
    this.status_row.html(`<small>Suche ${this.id}</small> <div class="spinner-grow spinner-grow-sm" role="status"><span class="sr-only">Lade Informationen...</span></div>`)
  }

  _loadData(handler) {
    this.load_button.html('<i class="fa fa-circle-o-notch fa-spin"></i>')
    setTimeout( () => {
      handler(this.planung)
      this.load_button.html(`Lade ${this.id}`)
      this.modal.modal('hide')
    }, 1000)
  }

}