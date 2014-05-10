#!/bin/bash

source ~/rfidquizgame/setup/envvars.sh

chmod +x ~/rfidquizgame/setup/startup.sh
chmod +x ~/rfidquizgame/setup/git_update.sh
chmod +x ~/rfidquizgame/embedded_linux/install_em_linux.sh
chmod +x ~/rfidquizgame/mifare/setup_mifare.sh
chmod +x ~/rfidquizgame/website/setup_website.sh
chmod +x ~/rfidquizgame/linux/setup_linux.sh
chmod +x ~/rfidquizgame/setup/envvars.sh


#Run init scripts

~/rfidquizgame/setup/startup.sh


### Mac Setup Environment

if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi mac"'!'" Gonna setup development environment"

	if hash brew 2>/dev/null
		then
		echo "brew installed"
	else

		if hash ruby -v 2>/dev/null
			then
			echo "Ruby is installed"
			ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
		else
			echo "Gotta install ruby first yoz. how come your mac doesn't come with ruby?"
		fi

	fi

	echo "Brew is installed, updating applications"
	brew doctor
	brew update

	echo "inspecting BASH_RC for homebrew github token"

	if cat ~/.bashrc | grep "export HOMEBREW_GITHUB_API_TOKEN"
		then
		echo "token installed"
	else
		echo 'export HOMEBREW_GITHUB_API_TOKEN=9eeef0eb8e3d167d168deca07d2cfd98c1048353' >> ~/.bashrc
		source ~/.bashrc
	fi

	echo "Homebrew token installed"
	echo "Installing applications on brew"

	brew install coreutils subversion python3 sshfs ttytter python3-setuptools python3-pip wireshark nmap autoconf libtool tmux

	#	Notes
	##	for tmux on mac, if you are using iterm, it has integrated mouse support, else, visit https://gist.github.com/simme/1297707


	if watch --help 2>/dev/null
		then
		echo "watch installed"
	else
		echo "Installing watch command on mac"
		curl -O http://ktwit.net/code/watch-0.2-macosx/watch
		chmod +x watch
		sudo mv watch /usr/local/bin/
	fi
	echo "Watch command installed"

	## End of setup on development environment

	brew update
	brew tap jlhonora/lsusb
	brew install lsusb
	brew install node
	brew install mongodb

	~/rfidquizgame/website/mongo_db_mac.sh
	~/rfidquizgame/embedded_linux/install_em_linux.sh

	exit

fi





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

#systemctl restart sshd



#######################################################
#git stash -> all git clones are stashed at this folder
#cd ~/rfidquizstash

#Time updating
timedatectl set-timezone Asia/Singapore
timedatectl set-ntp 1 #sets ntp
/usr/bin/ntpdate -b -s -u pool.ntp.org
hwclock --systohc --utc


#CONFIG SSH
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
cp ~/rfidquizgame/network/sshd_config.config /etc/ssh/sshd_config
systemctl restart sshd


## Installation commences

#Core Updates
pacman -Syu
#BASE DEVEL
pacman -S --needed base-devel
##wifi
##pacman -S iw wpa_supplicant dialog wpa_actiond



#Softwares
pacman -S --needed sudo fortune-mod cowsay ponysay vim nano tmux autoconf

##Rest of setup scripts
##mifare
~/rfidquizgame/mifare/setup_mifare.sh
##network
~/rfidquizgame/website/setup_website.sh
##linux system
~/rfidquizgame/linux/setup_linux.sh


#setup cron
#write out current crontab
if crontab -l | grep '@reboot /rfidquizgame/setup/startup.sh'
	then
	echo "crontab startupscript installed"
else
	echo "installing crontab startup script"
	crontab -l | { cat; echo "@reboot /rfidquizgame/setup/startup.sh"; } | crontab -
fi

#Run init scripts
#~/rfidquizgame/setup/startup_apps.sh


