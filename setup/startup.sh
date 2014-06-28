#!/bin/bash

echo "This is the setup script for BeagleBone Black Based RFID Quiz System!"
echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

mkdir ~/rfidquizstash

## Check whether all these commands run at startup

chmod +x ~/rfidquizgame/setup/tmux_startup.sh
chmod +x ~/rfidquizgame/hardware/hw_startup.sh

##System Environment

#Time updating
#timedatectl set-timezone Asia/Singapore
#timedatectl set-ntp 1 #sets ntp
/usr/bin/ntpdate -b -s -u pool.ntp.org
hwclock --systohc --utc

##Hardware startup
~/rfidquizgame/hardware/hw_startup.sh

if i2cdetect -y -r 1 | grep "27"
    then
    cp ~/rfidquizgame/hardware/startup_lcd.js ~/rfidquizstash/startup_lcd.js
    node ~/rfidquizstash/startup_lcd.js
fi
