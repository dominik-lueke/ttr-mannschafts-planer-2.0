class FooterView {

  constructor(){
    $('#footer').append(`
      <div class="d-flex justify-content-between fixed-bottom bg-light text-dark vw-100">
          <div class="p-1">
            <div id="planung-tag" class="badge badge-dark mt-2 mb-1 d-none">
              <i class="fa fa-tag"></i>
              <span id="planung-tag-text">Aufstellungen geladen</span>
            </div>
          </div>
          <div class="p-1 mr-4">
            <div class="input-group">
              <small id="planung-tag-input-hint" class="planung-tag-input-group pt-1 pl-2 text-muted invisible ">Erstellen mit Eingabetaste</small>
              <input id="planung-tag-input-text" type="text" class="planung-tag-input-group ml-2 form-control form-control-sm rounded-sm bg-light invisible" size="30">
              <button
                id="planung-tag-input-button"
                type="button" class="planung-tag-input-group btn btn-light pt-0 pb-0" 
                data-toggle="tooltip" data-html="true" 
                data-template="<div class=&quot;tooltip&quot; role=&quot;tooltip&quot;><div class=&quot;arrow&quot;></div><div class=&quot;tooltip-inner tooltip-inner-wide&quot;></div></div>"
                title="Markiere den aktuellen Stand der Planung, um ihn später wieder zu laden">
                <i class="fa fa-tag"></i>
                <sub class="overlay-icon"><i class="fa fa-plus-circle"></i><sub>
              </button>
              <button id="planung-show-tags-button" type="button" class="btn btn-light pt-0 pb-0 pull-right"
                data-toggle="modal" data-target="#planung-tags-modal">
                <div 
                  data-toggle="tooltip" data-html="true" 
                  data-template="<div class=&quot;tooltip&quot; role=&quot;tooltip&quot;><div class=&quot;arrow&quot;></div><div class=&quot;tooltip-inner tooltip-inner-wide&quot;></div></div>"
                  title="Zeige gespeicherte Planungsstände">
                  <i class="fa fa-tags"></i> 
                  <sub><span id="planung-show-tags-button-number" class="badge badge-secondary overlay-icon" style="cursor:pointer;"></span></sub>
                </div>
              </button>
            </div>
          </div>
        </div>
    `)

    this.planung_tag = $('#planung-tag')
    this.planung_tag_text = $('#planung-tag-text')
    this.planung_tag_input_group = $('.planung-tag-input-group')
    this.planung_tag_input_button = $('#planung-tag-input-button')
    this.planung_tag_input_text = $('#planung-tag-input-text')
    this.planung_tag_input_hint = $('#planung-tag-input-hint')

    this.planung_show_tags_button = $('#planung-show-tags-button')
    this.planung_show_tags_button_number = $('#planung-show-tags-button-number')

    // initialize temp_tag_name to use it as default value
    this.temp_tag_name = ""

    // Ui events
    this.planung_tag_input_button.on('click', (event) => {
      this.planung_tag_input_button.tooltip('hide')
      this.planung_tag_input_text.toggleClass('invisible')
      this.planung_tag_input_text.focus()
      this.planung_tag_input_hint.toggleClass('invisible')
    })

    this.loadTag = () => {}
  }

  update = (model) => {
    // do not display footer on neu-oeffen-page
    if (model.planung.isNew){
      $('#footer').addClass('d-none')
    } else {
      $('#footer').removeClass('d-none')
    }

    // display "tag" or "add tag"
    $(`#planung-tag`).tooltip('dispose')
    if (model.planung.tag !== "" && model.planung.tag in model.tags ) {
      this.planung_tag_text.text(model.tags[model.planung.tag].name)
      this.planung_tag.removeClass('d-none')
      if (model.planung.tag_is_active) {
        // tag is active
        this.planung_tag.removeClass("inactive-tag")
        // remove click event from tag
        $(`#planung-tag`).off('click')
        // disable adding a new tag
        this.planung_tag_input_group.addClass('d-none')
      } else {
        // tag is inactive
        this.planung_tag.addClass("inactive-tag")
        // activate tooltip
        $(`#planung-tag`).tooltip({
          "title": "Lade den letzten Zwischenstand. Die aktuellen Änderungen werden verworfen!"
        })
        // add load on click event
        $(`#planung-tag`).on('click', (event) => {
          this.loadTag(model.planung.tag)
        })
        // adding new tag is possible
        this.planung_tag_input_group.removeClass('d-none')
        this.planung_tag_input_text.val("")
      }
    } else {
      // adding new tag is possible
      this.planung_tag.addClass('d-none')
      this.planung_tag_input_group.removeClass('d-none')
      this.planung_tag_input_text.val("")
    }

    // display "tag selection button"
    var tag_count = Object.keys(model.tags).length
    var new_temp_tag_count = tag_count
    do {
      // prevent that the same tag name is used twice
      new_temp_tag_count = new_temp_tag_count+1
      this.temp_tag_name = `Zwischenstand #${new_temp_tag_count}`
    } while (Object.keys(model.tags).map(key => model.tags[key].name).includes(this.temp_tag_name))
    this.planung_tag_input_text.attr('placeholder', this.temp_tag_name)
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

  bindLoadTag(handler){
    this.loadTag = handler
  }

  _addTagKeyUpHandler = (event, handler) => {
    event.preventDefault()
    // On <Enter> we edit name
    if (event.keyCode === 13) {
      if (this.planung_tag_input_text.val() == ""){
        this.planung_tag_input_text.val(this.temp_tag_name)
      }
      this.planung_tag_input_text.blur() // delegate to the focusout handler
      this.planung_tag_input_text.addClass('invisible')
      this.planung_tag_input_hint.addClass('invisible')
    // On <Escape> we cancel
    } else if (event.keyCode === 27) {
      this.planung_tag_input_text.val("")
      this.planung_tag_input_text.addClass('invisible')
      this.planung_tag_input_hint.addClass('invisible')
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
    this.planung_tag_input_text.addClass('invisible')
    this.planung_tag_input_hint.addClass('invisible')
  }

  _addTag(handler){
    handler(this.planung_tag_input_text.val())
  }

}