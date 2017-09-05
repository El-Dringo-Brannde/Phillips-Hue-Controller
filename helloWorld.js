var hueJay = require("huejay");
var Startup = (function () {
    function Startup() {
        this.username = require("./username");
    }
    Startup.prototype.main = function () {
        console.log(this.username);
        this.discoverBridges();
        return 0;
    };
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
        var _this = this;
        this.client.bridge.isAuthenticated()
            .then(function () {
            console.log("User authenticated, welcome!");
            _this.getCurrentLights();
        })
            .catch(function (err) { return console.log("Hull Breach! " + err); });
    };
    Startup.prototype.getCurrentLights = function () {
        var _this = this;
        this.client.lights.getAll()
            .then(function (lights) {
            setInterval(function () {
                for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
                    var i = lights_1[_i];
                    _this.changeLightState(i);
                }
            }, 5000);
        });
    };
    ;
    Startup.prototype.changeLightState = function (light) {
        if (light.type == "Dimmable light")
            light.on = false;
        else {
            light.on = true;
            light.incrementHue = 6500;
            light.incrementSaturation = 25;
            light.transitionTime = 5;
        }
        return this.client.lights.save(light);
    };
    return Startup;
}());
var Start = new Startup();
Start.main();
