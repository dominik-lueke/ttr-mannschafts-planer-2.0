class PlanungTagsModalView {

  constructor() {
    $("#planungTagsModal").append(`
      <div class="modal fade" id="planung-tags-modal" tabindex="-1" role="dialog" aria-labelledby="planung-tags-modal-label" aria-hidden="true" data-backdrop="static" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="planung-tags-modal-label">Gespeicherte Zwischtenstände</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div id="planung-tags-modal-body" class="modal-body p-0">
              <ul class="list-group list-group-flush">
              </ul>
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>
    `)
    // cache jq elements
    this.modal_body = $("#planung-tags-modal-body")
    this.tag_list = this.modal_body.find('ul')

    this.loadTag = () => {}
    this.deleteTag = () => {}
  }

  bindLoadTag(handler){
    this.loadTag = handler
  }

  bindDeleteTag(handler){
    this.deleteTag = handler
  }

  update(model){
    // erase all tags
    this.tag_list.empty()
    // Hide if empty
    if (Object.keys(model.tags).length === 0){
      this.hide()
    }
    // create new tags
    Object.keys(model.tags)
    .sort((a,b) => {
      return Date.parse(model.tags[b].date) - Date.parse(model.tags[a].date)
    })
    .forEach(tag => {
      const tag_content = model.tags[tag]
      this.tag_list.append(`
        <li class="list-group-item p-2">
          <div class="d-flex">
            <div class="p-1 pl-2 flex-grow-1">
              <div class="badge badge-dark tag-list-item-badge">
                <i class="fa fa-tag"></i> ${tag_content.name}</div><br/>
                <small class="text-muted">${tag_content.date_str}</small>
                <small class="text-muted">(${tag_content.tag_size})</small>
              </div>
              <div class="p-1">
                <button id="tag-load-${tag}" class="btn btn-sm btn-success"
                  data-toggle="tooltip" data-placement="top" data-html="true"
                  title="Lade diesen Zwischenstand<br/><b>Achtung! Der aktuelle Stand der Planung geht verloren, wenn dieser nicht gesichert wurde!</b>">
                  <i class="fa fa-share"></i>
                </button>
              </div>
              <div class="p-1">
                <button id="tag-delete-${tag}" class="btn btn-sm btn-danger"
                  data-toggle="tooltip" data-placement="top" title="Lösche diesen Zwischenstand">
                  <i class="fa fa-trash"></i></button>
              </div>
            </div>
        </li>
      `)
      $(`#tag-load-${tag}`).click( () => {
        $(`#tag-load-${tag}`).tooltip('dispose')
        this.hide()
        this.loadTag(tag)
      })
      $(`#tag-delete-${tag}`).click( () => {
        $(`#tag-delete-${tag}`).tooltip('dispose')
        this.deleteTag(tag)
      })
      // activate tooltips
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  hide() {
    $("#planung-tags-modal").modal('hide')
  }

  destroy() {
    this.hide()
    $("#planungTagsModal").empty()
  }

}