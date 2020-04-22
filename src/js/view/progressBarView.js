class ProgressBarView {
  constructor(){
    $('#progressbar').append(`
      <div class="progressbar-container">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
          </div>
        </div>
      </div>
    `)
    this.progressbar_container=$('#progressbar .progressbar-container')
    this.progressbar=$('#progressbar .progressbar-container .progress-bar')
    this.current_color = ""
    this.current_textcolor = ""
    this.hide()
  }
  
  show(color="primary", textcolor="white", text="", timeout=-1){
    // hide the current message
    this.progressbar_container.hide()
    // display
    this.progressbar.removeClass(this.current_color).removeClass(this.current_textcolor)
    this.current_color = `bg-${color}`
    this.current_textcolor = `text-${textcolor}`
    this.progressbar.addClass(this.current_color).removeClass(this.current_textcolor)
    this.progressbar.text(text)
    this.progressbar_container.fadeIn(250)
    // timeout
    if (timeout > 0) {
      this.progressbar_container.delay(timeout).fadeOut(250)
    }
  }

  hide(timeout=0){
    this.progressbar_container.delay(timeout).fadeOut(250)
  }

}