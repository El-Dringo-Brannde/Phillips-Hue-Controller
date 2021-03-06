module.exports = class colorCalc {
   public static hex_to_rgb(hexVal: string): Array<number> {
      return hexVal.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
         , (m, r, g, b) => '#' + r + r + g + g + b + b)
         .substring(1).match(/.{2}/g)
         .map(x => parseInt(x, 16))
   }

   public static hex_to_cie(hexVal: string): Array<number> {
      let rgbVal = this.hex_to_rgb(hexVal)
      return this.rgb_to_cie(rgbVal[0], rgbVal[1], rgbVal[2])
   }


   public static cie_to_rgb(x: number, y: number, brightness: number): Array<number> {
      //Set to maximum brightness if no custom value was given (Not the slick ECMAScript 6 way for compatibility reasons)
      if (brightness === undefined) {
         brightness = 254;
      }

      var z = 1.0 - x - y;
      let Y: any = (brightness / 254).toFixed(2);
      var X: number = (Y / y) * x;
      var Z: number = (Y / y) * z;

      //Convert to RGB using Wide RGB D65 conversion
      var red = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
      var green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
      var blue = X * 0.051713 - Y * 0.121364 + Z * 1.011530;

      //If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
      if (red > blue && red > green && red > 1.0) {
         green = green / red;
         blue = blue / red;
         red = 1.0;
      }
      else if (green > blue && green > red && green > 1.0) {
         red = red / green;
         blue = blue / green;
         green = 1.0;
      }
      else if (blue > red && blue > green && blue > 1.0) {
         red = red / blue;
         green = green / blue;
         blue = 1.0;
      }

      //Reverse gamma correction
      red = red <= 0.0031308 ? 12.92 * red : (1.0 + 0.055) * Math.pow(red, (1.0 / 2.4)) - 0.055;
      green = green <= 0.0031308 ? 12.92 * green : (1.0 + 0.055) * Math.pow(green, (1.0 / 2.4)) - 0.055;
      blue = blue <= 0.0031308 ? 12.92 * blue : (1.0 + 0.055) * Math.pow(blue, (1.0 / 2.4)) - 0.055;


      //Convert normalized decimal to decimal
      red = Math.round(red * 255);
      green = Math.round(green * 255);
      blue = Math.round(blue * 255);

      if (isNaN(red))
         red = 0;

      if (isNaN(green))
         green = 0;

      if (isNaN(blue))
         blue = 0;


      return [red, green, blue];
   }
   public static rgb_to_cie(red, green, blue): Array<number> {
      //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
      var red1 = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
      var green1 = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
      var blue1 = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

      //RGB values to XYZ using the Wide RGB D65 conversion formula
      var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
      var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
      var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

      //Calculate the xy values from the XYZ values
      var x: any = (X / (X + Y + Z)).toFixed(4);
      var y: any = (Y / (X + Y + Z)).toFixed(4);

      if (isNaN(x))
         x = 0;

      if (isNaN(y))
         y = 0;


      return [parseFloat(x), parseFloat(y)];
   }
}