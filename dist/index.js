const { app, Tray, BrowserWindow } = require('electron');
var emitter = require('./utility/events');
const builtTouchBar = require('./Interactions/touchBar');
class trayIcon {
    constructor() {
        this.appIcon = null;
        app.on('ready', () => {
            emitter.on('connected', () => {
                this.initTrayIcon();
            });
        }); // Hack to hide icon til ready
    }
    initTrayIcon() {
        this.bw = new BrowserWindow({ transparent: true, frame: false, show: false });
        this.appIcon = new Tray(__dirname + '/icons/lightbulb.png');
        this.appIcon.setToolTip('Control Hue Lights');
        app.dock.hide();
        this.initTouchBar();
        this.initListeners();
    }
    initTouchBar() {
        var f = this.bw;
        this.bw.setTouchBar(builtTouchBar.TB);
    }
    initListeners() {
        this.appIcon.on('click', () => {
            this.bw.isVisible() ? this.bw.hide() : this.bw.show();
        });
        this.appIcon.on('right-click', () => this.appIcon.popUpContextMenu(this.contextMenu));
        this.bw.on('show', () => this.appIcon.setHighlightMode('always'));
        this.bw.on('hide', () => this.appIcon.setHighlightMode('never'));
    }
}
let trayApp = new trayIcon();
