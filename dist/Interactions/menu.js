let { Menu } = require('electron');
var controller = require('./../controllers/lightController');
console.log(controller);
var builtMenu = Menu.buildFromTemplate([{
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
module.exports = builtMenu;
