class FooterView {

  constructor(){
    $('#footer').append(`
      <div class="d-flex fixed-bottom bg-light text-dark vw-100">
          <div class="p-1">
            <div id="planung-tag" class="badge badge-dark mt-2 mb-1 d-none">
              <i class="fa fa-tag"></i>
              <span id="planung-tag-text">Aufstellungen geladen</span>
            </div>
            <div id="planung-tag-input-group" class="input-group">
              <div
                id="planung-tag-input-button"
                type="button" class="btn btn-light pt-0 pb-0" 
                data-toggle="tooltip" data-placement="right" data-html="true" 
                data-template="<div class=&quot;tooltip&quot; role=&quot;tooltip&quot;><div class=&quot;arrow&quot;></div><div class=&quot;tooltip-inner tooltip-inner-wide&quot;></div></div>"
                title="Markiere den aktuellen Stand der Planung, um ihn später wieder zu laden">
                <i class="fa fa-tag"></i>
              </div>
              <input id="planung-tag-input-text" type="text" class="form-control form-control-sm rounded-sm bg-light d-none" size="30" placeholder="Zwischenstand #1"> 
            </div>
          </div>
          <div class="p-1 flex-fill">
          </div>
          <div class="p-1 mt-1 mr-4" >
            <button id="planung-show-tags-button" type="button" class="btn btn-light pt-0 pb-0"
              data-toggle="modal" data-target="#planung-tags-modal">
              <div 
                data-toggle="tooltip" data-placement="left" data-html="true" 
                data-template="<div class=&quot;tooltip&quot; role=&quot;tooltip&quot;><div class=&quot;arrow&quot;></div><div class=&quot;tooltip-inner tooltip-inner-wide&quot;></div></div>"
                title="Zeige gespeicherte Planungsstände">
                <i class="fa fa-tags"></i> 
                <sub><span id="planung-show-tags-button-number" class="badge badge-secondary overlay-icon" style="cursor:pointer;"></span></sub>
              </div>
            </button>
          </div>
        </div>
    `)

    this.planung_tag = $('#planung-tag')
    this.planung_tag_text = $('#planung-tag-text')
    this.planung_tag_input_group = $('#planung-tag-input-group')
    this.planung_tag_input_button = $('#planung-tag-input-button')
    this.planung_tag_input_text = $('#planung-tag-input-text')

    this.planung_show_tags_button = $('#planung-show-tags-button')
    this.planung_show_tags_button_number = $('#planung-show-tags-button-number')

    // Ui events
    this.planung_tag_input_button.on('click', (event) => {
      this.planung_tag_input_button.tooltip('hide')
      this.planung_tag_input_text.toggleClass('d-none')
      this.planung_tag_input_text.focus()
    })
  }

  update = (model) => {
    // do not display footer on neu-oeffen-page
    if (model.planung.isNew){
      $('#footer').addClass('d-none')
    } else {
      $('#footer').removeClass('d-none')
    }

    // display "tag" or "add tag"
    if (model.planung.tag !== "") {
      this.planung_tag_input_group.addClass('d-none')
      this.planung_tag_text.text(model.planung.tag)
      this.planung_tag.removeClass('d-none')
    } else {
      this.planung_tag.addClass('d-none')
      this.planung_tag_input_group.removeClass('d-none')
      this.planung_tag_input_text.val("")
    }

    // display "tag selection button"
    const tag_count = Object.keys(model.tags).length
    this.planung_tag_text.attr('placeholder', `Zwischtenstand #${tag_count+1}`)
    if (tag_count) {
      this.planung_show_tags_button.removeClass('d-none')
      this.planung_show_tags_button_number.text(tag_count)
    } else {
      this.planung_show_tags_button.addClass('d-none')
    }
  }

  bindAddTagToPlanung = (handler) => {
    this.planung_tag_input_text.on("keyup", (event) => { this._addTagKeyUpHandler(event, handler) } )
    this.planung_tag_input_text.focusout( (event) => { this._addTagFocusOutHandler(event, handler) } )
  }

  _addTagKeyUpHandler = (event, handler) => {
    event.preventDefault()
    // On <Enter> we edit name
    if (event.keyCode === 13) {
      this.planung_tag_input_text.blur() // delegate to the focusout handler
      this.planung_tag_input_text.addClass('d-none')
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.planung_tag_input_text.val("")
      this.planung_tag_input_text.addClass('d-none')
    }
  }

  _addTagFocusOutHandler(event, handler) {
    event.preventDefault()
    var input = this.planung_tag_input_text.val()
    // If not empty we edit name
    if (input !== "") { 
      this._addTag(handler)
    // Else we cancel
    } else {
      this.planung_tag_input_text.val("")
    }
    this.planung_tag_input_text.addClass('d-none')
  }

  _addTag(handler){
    handler(this.planung_tag_input_text.val())
  }

}