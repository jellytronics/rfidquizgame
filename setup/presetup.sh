#!/bin/bash

echo "Note: This is assuming that you have already installed the base system onto the Beaglebone Black."
echo "We will now install the git archives onto the sd card supplied"


pacman -Syu
pacman -S git udisks udevil
echo "formatting sdcard"
mkfs.ext4 /dev/mmcblk0p1
echo "mounting sdcard @ /media/sdcard"
udevil mount -o ro,noatime /dev/mmcblk0p1 /media/sdcard

git clone git@github.com:jellyjellyrobot/rfidquizgame.git ~/rfidquizgame

echo "running setup scripts"

~/rfidquizgame/setup/
chmod +x setup.sh #if needed
./setup.sh

