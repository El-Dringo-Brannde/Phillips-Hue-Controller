let hueJay = require("huejay");

class Startup {
   private client;
   private username = require("./username")

   public main(): number {
      console.log(this.username)
      this.discoverBridges();
      return 0;
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
            this.getCurrentLights();
         })
         .catch(err => console.log(`Hull Breach! ${err}`))
   }

   private getCurrentLights(): void {
      this.client.lights.getAll()
         .then(lights => {
            setInterval(() => {
               for (let i of lights)
                  this.changeLightState(i)
            }, 5000)
         });
   };


   private changeLightState(light: any): void {
      if (light.type == "Dimmable light")
         light.on = false
      else {
         light.on = true
         light.incrementHue = 6500;
         light.incrementSaturation = 25;
         light.transitionTime = 5;
      }
      return this.client.lights.save(light);
   }
}
let Start = new Startup();
Start.main();