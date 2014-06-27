#!/bin/bash

echo "This is the setup script for BeagleBone Black Based RFID Quiz System!"
echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

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
