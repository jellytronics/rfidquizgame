#!/bin/bash

echo "This is the setup script for BeagleBone Black Based RFID Quiz System!"

echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

chmod +x ~/rfidquizgame/setup/motd.sh
chmod +x ~/rfidquizgame/setup/git_update.sh
chmod +x ~/rfidquizgame/setup/tmux_commander.sh
chmod +x ~/rfidquizgame/setup/tmux_config.sh
chmod +x ~/rfidquizgame/setup/tmux_startup.sh
chmod +x ~/rfidquizgame/embedded_linux/install_em_linux.sh
chmod +x ~/rfidquizgame/linux/setup_linux.sh
chmod +x ~/rfidquizgame/mifare/setup_mifare.sh
chmod +x ~/rfidquizgame/mifare/tmux_mifare.sh
chmod +x ~/rfidquizgame/network/config_hostname.sh
chmod +x ~/rfidquizgame/network/network_init.sh


##System Environment

dhcpcd
ln -s /usr/share/zoneinfo/Asia/Singapore /etc/localtime
hwclock --systohc --utc

#CONFIG SSH
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
cp ~/rfidquizgame/network/sshd_config.config /etc/ssh/sshd_config
systemctl restart sshd

echo "Starting Quiz System"

echo "Starting Debug"
#~/rfidquizgame/setup/tmux_startup.sh

echo "Starting Services"
#Apache, PHP, SQL, MongoDB, whatever

echo "Starting Mifare Controller"


#if jumper1 is high: tgt is host, else tgt is cilent




