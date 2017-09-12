const {
   app,
   Tray,
   Menu,
   menuItem,
   BrowserWindow,
   TouchBar
} = require('electron');
const path = require('path');
const utility = require("./utility/utility")
const hueController = require("./controllers/huecontroller")

let { TouchBarColorPicker, TouchBarLabel } = TouchBar
let controller = new hueController();
class trayIcon {
   public contextMenu;
   private appIcon;
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
      this.appIcon.on('mouse-enter', () => this.bw.show())
      this.appIcon.on("mouse-leave", () => this.bw.hide())
   }


   private initTrayIcon(): void {
      app.on('ready', () => {
         this.bw = new BrowserWindow({ transparent: true, frame: false, show: false })
         this.appIcon = new Tray(path.join(__dirname, './icons/lightbulb.png'));
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
         this.appIcon.setContextMenu(this.contextMenu);
         app.dock.hide();
         this.initTouchBar();
      });
   }
}
let trayApp = new trayIcon();
