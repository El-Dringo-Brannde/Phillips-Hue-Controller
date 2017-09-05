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
         })
         .catch(err => console.log(`Hull Breach! ${err}`))
   }
}
let Start = new Startup();
Start.main();