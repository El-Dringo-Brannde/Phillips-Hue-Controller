let { Menu } = require('electron')
var hueLights = require('./../controllers/hueLights')

var builtMenu = Menu.buildFromTemplate([{
   label: "All Lights Off",
   type: "checkbox",
   checked: false,
   click: () => {
      hueLights.stopInterval();
      hueLights.lightState(true);
      hueLights.turnOffAllLights();
   }
},
{
   label: "All Lights On",
   type: "checkbox",
   checked: false,
   click: () => {
      hueLights.stopInterval();
      hueLights.lightState(false);
      hueLights.turnOnAllLights();
   }
},
{
   label: 'Quit',
   accelerator: 'Command+Q',
   selector: 'terminate:',
}
]);
module.exports = builtMenu;