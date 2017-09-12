"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var hue = require('./hueController');
var hueController = new hue();
console.log(hueController);
// Creates and configures an ExpressJS web server.
var App = (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
        this.express.listen(3005, function () {
            console.log("Listening on 3005");
        });
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var router = express.Router();
        router.get('/lateNightCoding', function (req, res, next) {
            hueController.lateNightCoding();
            res.json({ message: "Switching to late night coding mode." });
        });
        router.get("/dayTimeLights", function (req, res, next) {
            hueController.morningMode();
            res.json({ message: "Switching to morning mode." });
        });
        this.express.use('/', router);
    };
    return App;
}());
exports.default = new App().express;
