class AlertView {

  constructor(){
    this.html=`
      <div class="alert-container">
        <div id="saisonplanung-alert" class="alert alert-dismissible fade show" role="alert">
          <div id="saisonplanung-alert-message">
          </div>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    `
    this.init()
    // reset the alert if it is closed
    $('#saisonplanung-alert').on('closed.bs.alert', () => {
      this.init()
    })
  }

  init(){
    $('#alert').append(this.html)
    this.alert_container=$('#alert .alert-container')
    this.alert_container.hide()
    this.saisonplanung_alert=$('#saisonplanung-alert')
    this.saisonplanung_alert_message=$('#saisonplanung-alert-message')
    this.current_type = ""
  }

  displayAlert(type="primary", html_content="", timeout=3000){
    // hide the current message
    this.alert_container.hide()
    // display
    this.saisonplanung_alert.removeClass(this.current_type)
    this.current_type = `alert-${type}`
    this.saisonplanung_alert.addClass(this.current_type)
    this.saisonplanung_alert_message.html(html_content)
    this.alert_container.fadeIn(250)
    // timeout
    if (timeout > 0) {
      this.alert_container.delay(timeout).fadeOut(250)
    }
  }
}