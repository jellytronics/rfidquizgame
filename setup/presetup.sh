#!/bin/bash

echo "Note: This is assuming that you have already installed the base system onto the Beaglebone Black."
echo "We will now install the git archives onto the sd card supplied"


#Set up environment

pacman -Syu
pacman -S git udisks udevil
#echo "formatting sdcard"
#mkfs.ext4 /dev/mmcblk0p1
echo "mounting sdcard @ /media/sdcard"
udevil mount -o ro,noatime /dev/mmcblk0p1 /media/sdcard


#Set up ssh




#Set up git folder

git clone git@github.com:jellyjellyrobot/rfidquizgame.git ~/rfidquizgame

echo "running setup scripts"

<<PENDING_DEV

~/rfidquizgame/setup/
chmod +x setup.sh #if needed
./setup.sh

PENDING_DEV