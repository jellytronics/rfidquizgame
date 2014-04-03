#!/bin/bash

echo "This is the setup script for BeagleBone Black Based RFID Quiz System!"

echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

##System Environment

export EDITOR=vim
dhcpcd
ln -s /usr/share/zoneinfo/Asia/Singapore /etc/localtime
hwclock --systohc --utc

echo "Editing ssh config"
if cat /etc/ssh/sshd_config | grep "Banner ~/rfidquizgame/network/banner"
	then
	echo "Banner installed"
else
	echo "Installing banner"
	cat "Banner ~/rfidquizgame/network/banner" >> /etc/ssh/sshd_config
	systemctl start sshd
fi

#echo "Upgrading system"
#pacman -Syu
#time consuming

echo "Starting Debug"
#~/rfidquizgame/setup/tmux_startup.sh

echo "Starting Services"
#Apache, PHP, SQL, MongoDB, whatever

echo "Starting Mifare Controller"

echo "Starting Quiz System"
#if jumper1 is high: tgt is host, else tgt is cilent


