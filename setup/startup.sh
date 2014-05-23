#!/bin/bash

echo "This is the setup script for BeagleBone Black Based RFID Quiz System!"
echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

## Check whether all these commands run at startup

chmod +x ~/rfidquizgame/setup/motd.sh
chmod +x ~/rfidquizgame/setup/git_update.sh
chmod +x ~/rfidquizgame/setup/tmux_commander.sh
chmod +x ~/rfidquizgame/setup/tmux_startup.sh
chmod +x ~/rfidquizgame/embedded_linux/install_em_linux.sh
chmod +x ~/rfidquizgame/linux/setup_linux.sh
chmod +x ~/rfidquizgame/mifare/setup_mifare.sh
chmod +x ~/rfidquizgame/mifare/tmux_mifare.sh
chmod +x ~/rfidquizgame/network/config_hostname.sh
chmod +x ~/rfidquizgame/network/network_init.sh


##System Environment

#Time updating
#timedatectl set-timezone Asia/Singapore
#timedatectl set-ntp 1 #sets ntp
/usr/bin/ntpdate -b -s -u pool.ntp.org
hwclock --systohc --utc

#mount sd cards
echo "mounting sdcard @ /media/sdcard"
udevil mount -o ro,noatime /dev/mmcblk0p1 /media/sdcard

#setup init env
source ~/rfidquizgame/setup/envvars.sh

#Run init scripts
#~/rfidquizgame/setup/startup_apps.sh
