const {
   app,
   Tray,
   Menu,
   BrowserWindow,
   TouchBar
} = require('electron');
const path = require('path');
const utility = require("./utility/utility")
const hueController = require("./controllers/huecontroller")
let trayHack = null;
let { TouchBarColorPicker, TouchBarLabel } = TouchBar
let controller = new hueController();
class trayIcon {
   public contextMenu;
   private appIcon = null;
   private bw;
   constructor() {
      this.initTrayIcon();
   }

   private initTouchBar(): void {
      let label = new TouchBarLabel()
      label.label = "Choose a color ➡️"
      let tb = new TouchBar([
         label,
         new TouchBarColorPicker({
            change: color => {
               this.contextMenu.items[0].checked = false;
               controller.stopInterval();
               controller.setRGBColor(utility.hex_to_cie(color))
            }
         })
      ]);
      this.bw.setTouchBar(tb)
      this.appIcon.on('click', () => {
         this.bw.show();
         this.appIcon.popUpContextMenu(this.contextMenu)
         this.bw.hide();
      });
   }


   private initTrayIcon(): void {
      app.on('ready', () => {
         this.bw = new BrowserWindow({ transparent: true, frame: false, show: false })
         // console.log(./icons/lightbulb.png)
         this.appIcon = new Tray('./icons/lightbulb.png');
         this.contextMenu = Menu.buildFromTemplate([{
            label: "Cycle colors",
            type: "checkbox",
            checked: false,
            click: () => {
               if (this.contextMenu.items[0].checked)
                  controller.lateNightCoding()
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
         this.appIcon.setToolTip('Control Hue Lights')
         app.dock.hide();
         this.initTouchBar();
      });
   }
}
let trayApp = new trayIcon();