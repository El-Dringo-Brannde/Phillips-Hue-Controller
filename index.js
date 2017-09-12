var _a = require('electron'), app = _a.app, Tray = _a.Tray, Menu = _a.Menu, menuItem = _a.menuItem, BrowserWindow = _a.BrowserWindow, TouchBar = _a.TouchBar;
var path = require('path');
var utility = require("./utility/utility");
var hueController = require("./controllers/huecontroller");
var TouchBarColorPicker = TouchBar.TouchBarColorPicker, TouchBarLabel = TouchBar.TouchBarLabel;
var controller = new hueController();
var trayIcon = (function () {
    function trayIcon() {
        this.initTrayIcon();
    }
    trayIcon.prototype.initTouchBar = function () {
        var _this = this;
        var label = new TouchBarLabel();
        label.label = "Choose a color ➡️";
        var tb = new TouchBar([
            label,
            new TouchBarColorPicker({
                change: function (color) {
                    _this.contextMenu.items[0].checked = false;
                    controller.stopInterval();
                    controller.setRGBColor(utility.hex_to_cie(color));
                }
            })
        ]);
        this.bw.setTouchBar(tb);
        this.appIcon.on('mouse-enter', function () { return _this.bw.show(); });
        this.appIcon.on("mouse-leave", function () { return _this.bw.hide(); });
    };
    trayIcon.prototype.initTrayIcon = function () {
        var _this = this;
        app.on('ready', function () {
            _this.bw = new BrowserWindow({ transparent: true, frame: false, show: false });
            _this.appIcon = new Tray(path.join(__dirname, './icons/lightbulb.png'));
            _this.contextMenu = Menu.buildFromTemplate([{
                    label: "Cycle colors",
                    type: "checkbox",
                    checked: false,
                    click: function () {
                        if (_this.contextMenu.items[0].checked)
                            controller.lateNightCoding();
                        else
                            controller.stopInterval();
                    }
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    selector: 'terminate:',
                }
            ]);
            _this.appIcon.setContextMenu(_this.contextMenu);
            app.dock.hide();
            _this.initTouchBar();
        });
    };
    return trayIcon;
}());
var trayApp = new trayIcon();
