"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
let hue = require('./hueController');
let hueController = new hue();
console.log(hueController);
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.express.listen(3005, function () {
            console.log("Listening on 3005");
        });
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        router.get('/lateNightCoding', (req, res, next) => {
            hueController.lateNightCoding();
            res.json({ message: "Switching to late night coding mode." });
        });
        router.get("/dayTimeLights", (req, res, next) => {
            hueController.morningMode();
            res.json({ message: "Switching to morning mode." });
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
