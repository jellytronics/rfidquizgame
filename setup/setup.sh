#!/bin/bash

#Presetup (Run Once)

function addtofile {
	##unstable
	if cat $1 | grep $2
		then
		echo "it is already included"
	else
		cat $2 >> $1
	fi
}

echo "This is the setup (Run Once) script for BeagleBone Black Based RFID Quiz System!"

echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"



#Basic
##loadkeys us
##echo "Checking LAN Config"
##ifconfig
##ping -c 3 www.google.com

#######################################################
#git stash -> all git clones are stashed at this folder
#cd ~/rfidquizstash

systemctl restart sshd

#STARTUP

##SSHBANNER
if cat /etc/ssh/sshd_config | grep "Banner ~/rfidquizgame/network/banner"
	then
	echo "Banner installed"
else
	echo "Installing banner"
	cat "Banner ~/rfidquizgame/network/banner" >> /etc/ssh/sshd_config
	systemctl start sshd
fi
##BASHMOTD
if cat ~/.bashrc | grep "command cowsay $(fortune)"
	then
	echo "Banner installed"
else
	echo "Installing banner"
	cat "command cowsay $(fortune)" >> ~/.bashrc
	#cat "#auto cd into dir" >> ~/.bashrc
	#cat "shopt -s autocd" >> ~/.bashrc
fi


#BASE DEVEL
pacman -S base-devel
##wifi
pacman -S iw wpa_supplicant dialog wpa_actiond

#SSH
pacman -S git



#Softwares
pacman -S sudo alsa-utils ttf-dejavu fortune-mod cowsay ponysay vim nano tmux autoconf

##Rest of setup scripts
##mifare
#~/rfidquizgame/mifare/setup_mifare.sh
##network
#~/rfidquizgame/website/setup_website.sh
##tmux
#~/rfidquizgame/setup/tmux_setup.sh


#Run init scripts



