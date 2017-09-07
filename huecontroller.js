var hueJay = require("huejay");
var util = require("./utility");
module.exports = (function () {
    function Startup() {
        this.username = require("./username");
        this.discoverBridges();
    }
    Startup.prototype.discoverBridges = function () {
        var _this = this;
        hueJay.discover()
            .then(function (bridges) {
            for (var _i = 0, bridges_1 = bridges; _i < bridges_1.length; _i++) {
                var i = bridges_1[_i];
                _this.connectToBridge(i.ip);
            }
        })
            .catch(function (error) { return console.log("Oh nose error, " + error.message); });
    };
    Startup.prototype.connectToBridge = function (ipAddress) {
        this.client = new hueJay.Client({
            host: ipAddress,
            username: this.username
        });
        this.authenticateClient();
    };
    Startup.prototype.authenticateClient = function () {
        this.client.bridge.isAuthenticated()
            .then(function () {
            console.log("User authenticated, welcome!");
        })
            .catch(function (err) { return console.log("Hull Breach! " + err); });
    };
    Startup.prototype.setRGBColor = function () {
        var _this = this;
        var newXY = util.rgb_to_cie(255, 39, 60); //red
        this.client.lights.getAll()
            .then(function (lights) {
            for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
                var light = lights_1[_i];
                if (light.type != "Dimmable light") {
                    light.on = true;
                    light.xy = util.rgb_to_cie(0, 0, 139); // red
                    light.transitionTime = 5;
                }
                else
                    light.on = false;
                _this.client.lights.save(light);
            }
        });
    };
    Startup.prototype.morningMode = function () {
        var _this = this;
        this.client.lights.getAll()
            .then(function (lights) {
            for (var _i = 0, lights_2 = lights; _i < lights_2.length; _i++) {
                var light = lights_2[_i];
                if (light.type != "Dimmable light") {
                    light.on = true;
                    light.xy = util.rgb_to_cie(255, 204, 0); // red
                    light.transitionTime = 5;
                }
                else
                    light.on = true;
                _this.client.lights.save(light);
            }
        });
    };
    Startup.prototype.lateNightCoding = function () {
        var _this = this;
        this.client.lights.getAll()
            .then(function (lights) {
            setInterval(function () {
                for (var _i = 0, lights_3 = lights; _i < lights_3.length; _i++) {
                    var light = lights_3[_i];
                    if (light.type != "Dimmable light") {
                        light.on = true;
                        light.incrementHue = 6500;
                        light.incrementSaturation = 25;
                        light.transitionTime = 5;
                    }
                    else
                        light.on = false;
                    _this.client.lights.save(light);
                }
            }, 5000);
        });
    };
    return Startup;
}());
