import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
let hue = require('./hueController')

let hueController = new hue()
console.log(hueController)

// Creates and configures an ExpressJS web server.
class App {

   // ref to Express instance
   public express: express.Application;

   //Run configuration methods on the Express instance.
   constructor() {
      this.express = express();
      this.middleware();
      this.routes();
      this.express.listen(3005, function () {
         console.log("Listening on 3005")
      })
   }

   // Configure Express middleware.
   private middleware(): void {
      this.express.use(logger('dev'));
      this.express.use(bodyParser.json());
      this.express.use(bodyParser.urlencoded({ extended: false }));
   }

   // Configure API endpoints.
   private routes(): void {
      let router = express.Router();
      router.get('/lateNightCoding', (req, res, next) => {
         hueController.lateNightCoding();
         res.json({ message: "Switching to late night coding mode." });
      });

      router.get("/dayTimeLights", (req, res, next) => {
         hueController.morningMode();
         res.json({ message: "Switching to morning mode." });
      })
      this.express.use('/', router);

   }
}

export default new App().express;