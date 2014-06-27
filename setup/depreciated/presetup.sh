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


systemctl start sshd
systemctl enable sshd
systemctl is-enabled sshd
if cat 2> /dev/null
	then
	echo "ssh keys available"
else
	echo "ssh keys unavailable. making one now"
	cp ~/.ssh/id_rsa ~/.ssh/id_rsa.bu
	cp ~/.ssh/id_rsa.pub ~/.ssh/id_rsa.pub.bu
	ssh-keygen -q -f ~/.ssh/id_rsa -P ""
fi

echo "Bringing ssh-agent to sys env"
eval $(ssh-agent)
chmod 0600 /root/.ssh/id_rsa.pub
echo "Please enter "'""'" as passphrase in next line." 
ssh-add ~/.ssh/id_rsa.pub
echo "copy what you are about to see into the ssh-keys of your github account"
cat ~/.ssh/id_rsa.pub

#Set up git folder

git clone git@github.com:jellyjellyrobot/rfidquizgame.git ~/rfidquizgame

echo "running setup scripts"

<<PENDING_DEV

~/rfidquizgame/setup/
chmod +x setup.sh #if needed
./setup.sh

PENDING_DEV