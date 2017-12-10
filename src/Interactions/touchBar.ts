let { TouchBar } = require('electron')
let {
   TouchBarColorPicker,
   TouchBarLabel,
   TouchBarSpacer,
   TouchBarSegmentedControl,
   TouchBarButton
 } = TouchBar

var touchBarLabel = new TouchBarLabel()
var lights = require('./../controllers/lightController')
var util = require('./../utility/utility')
touchBarLabel.label = "Choose a color ➡️"
class touchBar {
   public touchBar;
   constructor() {
      this.buildTouchBar();
   }

   get TB() {
      return this.touchBar
   }

   private buildTouchBar() {
      this.touchBar = new TouchBar({
         items:
            [
               touchBarLabel,
               new TouchBarColorPicker({
                  change: color => {
                     // this.touchBar.contextMenu.items[0].checked = false;
                     lights.stopInterval();
                     lights.setRGBColor(util.hex_to_cie(color))
                  }
               }),
               new TouchBarSpacer({ size: 'flexible' }),
               new TouchBarButton({
                  label: 'Cycle Lights',
                  click: () => {
                     lights.cycleLights()

                  }
               }),
               new TouchBarSpacer({ size: 'flexible' }),
               new TouchBarSegmentedControl({
                  segments: [
                     { label: 'Lights On' },
                     { label: 'Lights Off' },
                  ],
                  change: (selected, isSelected) => {
                     console.log(selected)
                     if (selected == 1) // Off
                        lights.turnOffAllLights();
                     else
                        lights.turnOnAllLights();
                  }
               })
            ]
      });
   }
}

module.exports = new touchBar();
