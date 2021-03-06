#!/bin/bash

echo "This is the setup script for BeagleBone Black Based RFID Quiz System!"
echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

mkdir /root/rfidquizstash

## Check whether all these commands run at startup

#chmod +x /root/rfidquizgame/setup/tmux_startup.sh
#chmod +x /root/rfidquizgame/hardware/hw_startup.sh

##System Environment

#Time updating
#timedatectl set-timezone Asia/Singapore
#timedatectl set-ntp 1 #sets ntp
/usr/bin/ntpdate -b -s -u pool.ntp.org
hwclock --systohc --utc

##Hardware startup
~/rfidquizgame/hardware/hw_startup.sh

##Just in case
echo BB-UART1 > /sys/devices/bone_capemgr*/slots

##TMUX INIT
#/root/rfidquizgame/setup/tmux_startup.sh

if i2cdetect -y -r 1 | grep "27"
    then
    cd ~/rfidquizstash
    sleep 20
    cp ~/rfidquizgame/hardware/startup_lcd.js ~/rfidquizstash/startup_lcd.js
    node ~/rfidquizstash/startup_lcd.js
fi
