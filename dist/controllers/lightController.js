var hue = require('./huecontroller');
var util = require('./../utility/utility');
var emitter = require('./../utility/events');
class lightController {
    constructor() {
        emitter.on('authenticated', () => {
            console.log('lakdsjf');
            this.client = hue.clientInst;
        });
    }
    get classInst() {
        return this;
    }
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
                    light.xy = util.rgb_to_cie(255, 255, 255); // white
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
