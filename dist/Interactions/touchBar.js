let { TouchBar } = require('electron');
let { TouchBarColorPicker, TouchBarLabel, TouchBarSpacer, TouchBarSegmentedControl, TouchBarButton } = TouchBar;
var hueLights = require('./../controllers/hueLights');
var colorCalc = require('./../utility/colorCalc');
class touchBar {
    constructor() {
        this.label = new TouchBarLabel();
        this.label.label = "Choose a color ➡️";
        this.buildTouchBar();
    }
    get TB() {
        return this.touchBar;
    }
    buildTouchBar() {
        this.touchBar = new TouchBar({
            items: [
                this.label,
                new TouchBarColorPicker({
                    change: color => {
                        hueLights.stopInterval();
                        hueLights.setRGBColor(colorCalc.hex_to_cie(color));
                    }
                }),
                new TouchBarSpacer({ size: 'flexible' }),
                new TouchBarButton({
                    label: 'Cycle Lights',
                    click: () => hueLights.cycleLights()
                }),
                new TouchBarSpacer({ size: 'flexible' }),
                new TouchBarSegmentedControl({
                    segments: [
                        { label: 'Lights On' },
                        { label: 'Lights Off' },
                    ],
                    change: (selected, isSelected) => {
                        if (selected == 1)
                            hueLights.turnOffAllLights();
                        else
                            hueLights.turnOnAllLights();
                    }
                })
            ]
        });
    }
}
module.exports = new touchBar();
