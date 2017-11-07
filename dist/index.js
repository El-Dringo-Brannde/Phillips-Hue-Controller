const { app, Tray, Menu, BrowserWindow, TouchBar } = require('electron');
var emitter = require('./utility/events');
const utility = require("./utility/utility");
const hueController = require("./controllers/huecontroller");
let { TouchBarColorPicker, TouchBarLabel, TouchBarSpacer, TouchBarSegmentedControl, TouchBarButton } = TouchBar;
let controller = new hueController();
class trayIcon {
    constructor() {
        this.appIcon = null;
        app.on('ready', () => {
            emitter.on('connected', () => {
                this.initTrayIcon();
            });
        }); // Hack to hide icon til ready
    }
    initTouchBar() {
        let colorLabel = new TouchBarLabel();
        colorLabel.label = "Choose a color ➡️";
        let TCSegment = new TouchBarSegmentedControl({
            segments: [
                { label: 'Lights On' },
                { label: 'Lights Off' },
            ],
            change: (selected, isSelected) => {
                if (TCSegment.segments[selected].label.includes('On'))
                    controller.lightState = true;
                else
                    controller.lightState = false;
            }
        });
        let tb = new TouchBar({
            items: [
                colorLabel,
                new TouchBarColorPicker({
                    change: color => {
                        this.contextMenu.items[0].checked = false;
                        controller.stopInterval();
                        controller.setRGBColor(utility.hex_to_cie(color));
                    }
                }),
                new TouchBarSpacer({ size: 'flexible' }),
                new TouchBarButton({
                    label: 'Cycle Lights',
                    click: () => {
                        controller.cycleLights();
                    }
                }),
                new TouchBarSpacer({ size: 'flexible' }),
                TCSegment
            ]
        });
        this.bw.setTouchBar(tb);
    }
    initListeners() {
        this.appIcon.on('click', () => {
            this.bw.isVisible() ? this.bw.hide() : this.bw.show();
        });
        this.appIcon.on('right-click', () => this.appIcon.popUpContextMenu(this.contextMenu));
        this.bw.on('show', () => this.appIcon.setHighlightMode('always'));
        this.bw.on('hide', () => this.appIcon.setHighlightMode('never'));
    }
    initTrayIcon() {
        this.bw = new BrowserWindow({ transparent: true, frame: false, show: false });
        this.appIcon = new Tray('./icons/lightbulb.png');
        this.contextMenu = Menu.buildFromTemplate([{
                label: "All Lights Off",
                type: "checkbox",
                checked: false,
                click: () => {
                    controller.stopInterval();
                    controller.lightState(true);
                    controller.turnOffAllLights();
                }
            },
            {
                label: "All Lights On",
                type: "checkbox",
                checked: false,
                click: () => {
                    controller.stopInterval();
                    controller.lightState(false);
                    controller.turnOnAllLights();
                }
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                selector: 'terminate:',
            }
        ]);
        this.appIcon.setToolTip('Control Hue Lights');
        app.dock.hide();
        this.initTouchBar();
        this.initListeners();
    }
}
let trayApp = new trayIcon();
