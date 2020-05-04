// Get the ipcRenderer of electron
const {ipcRenderer} = require('electron');

// Do something according to a request of your mainview
ipcRenderer.on('getHtml', function(){
    ipcRenderer.sendToHost(getHTML());
});

function getHTML(){
    // Remove Ads ;-)
    ['#topBanner', '#mobileAdBottomWrapper'].forEach( selector => {
        var elem = document.querySelector(selector);
        if ( elem ) {
             elem.parentNode.removeChild(elem);
        }
    })
    // return the html
    return document.getElementsByTagName('body')[0].innerHTML
}