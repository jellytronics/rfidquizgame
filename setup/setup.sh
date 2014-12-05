#!/bin/bash


chmod +x ~/rfidquizgame/mifare/setup_mifare.sh
chmod +x ~/rfidquizgame/website/setup_website.sh
chmod +x ~/rfidquizgame/linux/setup_linux.sh

#Run init scripts


### Mac Setup Environment

if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi mac"'!'" Gonna setup development environment"

	if hash brew 2>/dev/null
		then
		echo "brew installed"
	else

		ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

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

	# sshfs cannot be installed on yosemite

	brew install coreutils subversion python3 ttytter wireshark nmap autoconf libtool tmux cowsay fortune
	brew install autoconf automake doxygen
	brew install libusb libusb-compat --universal
	brew install wget pkgconfig

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
	brew install tree

	#Install Scripts To be Updated
	~/rfidquizgame/website/mongo_db_mac.sh
	~/rfidquizgame/embedded_linux/install_em_linux.sh

	#Install Scripts
	~/rfidquizgame/linux/setup_linux.sh
	~/rfidquizgame/mifare/setup_mifare.sh
	~/rfidquizgame/website/setup_website.sh

	echo ""

	echo "channging hostname"

	sudo scutil --set HostName jellymac

	exit

fi



#Presetup (Run Once)


echo "This is the setup (Run Once) script for BeagleBone Black Based RFID Quiz System!"

echo "This script assumes that the BBB is installed with ArchLinux (ARM) OS"

mkdir ~/rfidquizstash
cd ~/rfidquizstash

#Time updating
timedatectl set-timezone Asia/Singapore
timedatectl set-ntp 1
/usr/bin/ntpdate -b -s -u pool.ntp.org
hwclock --systohc --utc


#CONFIG SSH
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
cp ~/rfidquizgame/network/sshd_config.config /etc/ssh/sshd_config
systemctl restart sshd


## Installation commences

##Networking
#pacman -S --needed iw wpa_supplicant dialog wpa_actiond
##Softwares
pacman -S --needed base-devel sudo fortune-mod cowsay ponysay vim nano tmux autoconf i2c-tools python ttytter nmap tmux zsh autoconf coreutils wireshark-cli openssh mongodb cronie

##start and enable cron
systemctl start cronie
systemctl enable cronie

##Rest of setup scripts
##linux system
~/rfidquizgame/linux/setup_linux.sh
##mifare
~/rfidquizgame/mifare/setup_mifare.sh
##network
~/rfidquizgame/website/setup_website.sh



#setup cron
#write out current crontab
if crontab -l | grep '@reboot /root/rfidquizgame/setup/startup.sh'
	then
	echo "crontab startupscript installed"
else
	echo "installing crontab startup script"
	crontab -l | { cat; echo "@reboot /root/rfidquizgame/setup/startup.sh"; } | crontab -
fi

#echo "@reboot /root/rfidquizgame/setup/startup.sh" | crontab -
#Run init scripts
#~/rfidquizgame/setup/startup_apps.sh
