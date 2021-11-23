class AutoUpdaterNotifactionView {

  constructor() {
    $("#auto-updater-notification").append(`
      <p id="auto-updater-message">
      </p>
      <button class="btn btn-light pull-right" id="auto-updater-close-button">
        Schließen
      </button>
      <button class="btn btn-outline-success pull-right d-none" id="auto-updater-later-button" >
        Später
      </button>
      <button class="btn btn-success mr-2 pull-right d-none" id="auto-updater-restart-button">
        Jetzt neu starten
      </button>
    `)
    this.notification = document.getElementById('auto-updater-notification')
    this.message = document.getElementById('auto-updater-message')
    this.closeButton = document.getElementById('auto-updater-close-button')
    this.laterButton = document.getElementById('auto-updater-later-button')
    this.restartButton = document.getElementById('auto-updater-restart-button')

    this.closeButton.addEventListener('click', () => this.closeNotification())
    this.laterButton.addEventListener('click', () => this.closeNotification())
  }

  displayUpdateAvailable() {
    this.message.innerHTML = 'Eine neue Version ist verfügbar und wird heruntergeladen <i id="auto-updater-loading-icon" class="fa fa-circle-o-notch fa-spin"></i>';
    this.notification.classList.remove('d-none');
  }

  displayDownloadDone() {
    this.message.innerHTML = '<i id="auto-updater-done-icon" class="fa fa-check text-success"></i> Download abgeschlossen. Jetzt neu starten, um das Update zu installieren?';
    this.closeButton.classList.add('d-none')
    this.laterButton.classList.remove('d-none');
    this.restartButton.classList.remove('d-none');
    this.notification.classList.remove('d-none');
  }

  closeNotification(){
    this.notification.classList.add('d-none');
  }

  bindRestartButtonClickHandler(handler){
    this.restartButton.addEventListener('click', () => handler())
  }

}