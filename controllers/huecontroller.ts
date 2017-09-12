let hueJay = require("huejay");
let util = require("./../utility/utility");

module.exports = class Startup {
   private client;
   private username = require("./username")
   private interval;

   constructor() {
      this.discoverBridges();
   }
   private discoverBridges(): void {
      hueJay.discover()
         .then(bridges => {
            for (let i of bridges) {
               this.connectToBridge(i.ip);
            }
         })
         .catch(error => console.log(`Oh nose error, ${error.message}`))
   }

   private connectToBridge(ipAddress: string): void {
      this.client = new hueJay.Client({
         host: ipAddress,
         username: this.username
      })
      this.authenticateClient();
   }

   private authenticateClient(): void {
      this.client.bridge.isAuthenticated()
         .then(() => {
            console.log("User authenticated, welcome!")
         })
         .catch(err => console.log(`Hull Breach! ${err}`))
   }

   public setRGBColor(newCIE: Array<number>): void {
      // let newXY = util.rgb_to_cie(r, g, b); //red
      this.client.lights.getAll()
         .then(lights => {
            for (let light of lights) {
               if (light.type != "Dimmable light") {
                  light.on = true
                  light.xy = newCIE
                  light.transitionTime = 5;
               } else
                  light.on = false;
               this.client.lights.save(light);
            }
         })
   }

   private morningMode(): void {
      this.client.lights.getAll()
         .then(lights => {
            for (let light of lights) {
               if (light.type != "Dimmable light") {
                  light.on = true
                  light.xy = util.rgb_to_cie(255, 204, 0); // red
                  light.transitionTime = 5;
               } else
                  light.on = true;
               this.client.lights.save(light);
            }
         })
   }

   private stopInterval(): void {
      clearInterval(this.interval)
   }

   private lateNightCoding(): void {
      this.client.lights.getAll()
         .then(lights => {
            this.interval = setInterval(() => {
               for (let light of lights) {
                  if (light.type != "Dimmable light") {
                     light.on = true
                     light.incrementHue = 6500;
                     light.incrementSaturation = 25;
                     light.transitionTime = 5;
                  } else
                     light.on = false;
                  this.client.lights.save(light);
               }
            }, 5000)
         });
   }
}

