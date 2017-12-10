var colorCalc = require('./../utility/colorCalc');
var emitter = require('./../utility/events');
class lightController {
    constructor() {
        this.hueClient = require('./huecontroller');
        emitter.on('authenticated', () => this.client = this.hueClient.clientInst);
    } //instantiate class after the hue bridge has authenticated the user on the bridge
    set lightState(state) {
        this.lightStates = state;
    }
    setRGBColor(newCIE) {
        this.client.lights.getAll()
            .then(lights => {
            for (let light of lights) {
                if (light.type != "Dimmable light") {
                    light.on = true;
                    light.xy = newCIE;
                    light.transitionTime = 5;
                }
                this.client.lights.save(light);
            }
        }).catch(() => { });
    }
    turnOnAllLights() {
        this.stopInterval();
        this.client.lights.getAll()
            .then(lights => {
            for (let light of lights) {
                if (light.type != 'Dimmable light')
                    light.xy = colorCalc.rgb_to_cie(255, 255, 255); // white
                light.on = true;
                light.brightness = 254;
                this.client.lights.save(light);
            }
        });
    }
    turnOffAllLights() {
        this.stopInterval();
        this.client.lights.getAll()
            .then(lights => {
            for (let light of lights) {
                light.on = false;
                this.client.lights.save(light);
            }
        });
    }
    stopInterval() {
        clearInterval(this.interval);
    }
    cycleLights() {
        this.client.lights.getAll()
            .then(lights => {
            this.interval = setInterval(() => {
                for (let light of lights) {
                    if (light.type != "Dimmable light") {
                        light.on = true;
                        light.incrementHue = 6500;
                        light.incrementSaturation = 25;
                        light.transitionTime = 5;
                    }
                    else
                        light.on = this.lightStates;
                    this.client.lights.save(light);
                }
            }, 5000);
        });
    }
}
module.exports = new lightController();
