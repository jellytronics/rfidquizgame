//LCD Setup
var LCD = require('lcd-pcf8574')
var lcd = new LCD('/dev/i2c-1', 0x27)
var os = require('os')
d=new Date;
var s=d.toString();
lcd.clear().setCursor(0,0).print('Beagleserver init')
lcd.setCursor(0,1).print(s.substring(0,15));
lcd.setCursor(0,2).print(s.substring(16,33));
lcd.setCursor(0,3).print(s.substring(34));
