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
        this.client.bridge.isAuthenticated()
            .then(function () {
            console.log("User authenticated, welcome!");
        })
            .catch(function (err) { return console.log("Hull Breach! " + err); });
    };
    return Startup;
}());
var Start = new Startup();
Start.main();
