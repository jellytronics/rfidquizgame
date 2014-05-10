#!/bin/sh

if [[ $(sw_vers -productName) == *Mac* ]]
	then
	if hash zsh 2>/dev/null
		then
		echo "zsh is already installed"
	else
		brew install zsh
	fi
else
	if hash zsh 2>/dev/null
		then
		echo "zsh is already installed"
	else
		pacman -S --needed zsh
	fi
fi

chsh -s /usr/bin/zsh

if cat ~/rfidquizstash/linux/zsh/oh-my-zsh/templates/zshrc.zsh-template 2>/dev/null | grep "arch"
	then
	cp ~/.zshrc ~/.zshrc.backup
	cp ~/rfidquizgame/linux/zshrc.config ~/.zshrc
	echo "oh-my-zsh is installed"
else
	echo "installing oh-my-zsh"
	git clone https://github.com/robbyrussell/oh-my-zsh.git ~/rfidquizstash/linux/zsh/oh-my-zsh
	cp ~/.zshrc ~/.zshrc.backup

	## This method works in all cases, but I want my zsh to be configured in my way, as such we use the method below
	#cp ~/rfidquizstash/linux/zsh/oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
	#cat ~/rfidquizstash/linux/zsh/oh-my-zsh/templates/zshrc.zsh-template | grep -Ev "export ZSH=" >> ~/rfidquizstash/linux/zsh/temp.text
	#cp ~/rfidquizstash/linux/zsh/temp.text ~/.zshrc
	#chsh -s $(which zsh)

	## Method 2, my prefered method yoz
	cp ~/rfidquizgame/linux/zshrc.config ~/.zshrc

	echo "oh-my-zsh is installed, for more info, look at https://github.com/robbyrussell/oh-my-zsh\nhave a nice day!"
fi

if hash tmuxinator 2>/dev/null
	then
	echo "tmuxinator is installed"
else
	pacman -S --needed ruby
	PATH="`ruby -e 'puts Gem.user_dir'`/bin:$PATH"
	git clone https://github.com/tmuxinator/tmuxinator.git ~/rfidquizstash/linux/tmuxinator
	sudo gem install tmuxinator --no-document
	echo "tmuxinator installed"
	sudo gem install bundler --no-document
	#gem update --no-document ##test this first
fi

#Setup all evnironment

#SHELLS
# # # # # # # # # # B A S H # # # # # # # # # # #
#+----------------+-----------+-----------+------+
#|                |Interactive|Interactive|Script|
#|                |login      |non-login  |      |
#+----------------+-----------+-----------+------+
#|/etc/profile    |   A       |           |      |
#+----------------+-----------+-----------+------+
#|/etc/bash.bashrc|           |    A      |      |
#+----------------+-----------+-----------+------+
#|~/.bashrc       |           |    B      |      |
#+----------------+-----------+-----------+------+
#|~/.bash_profile |   B1      |           |      |
#+----------------+-----------+-----------+------+
#|~/.bash_login   |   B2      |           |      |
#+----------------+-----------+-----------+------+
#|~/.profile      |   B3      |           |      |
#+----------------+-----------+-----------+------+
#|BASH_ENV        |           |           |  A   |
#+----------------+-----------+-----------+------+
#|                |           |           |      |
#+----------------+-----------+-----------+------+
#|                |           |           |      |
#+----------------+-----------+-----------+------+
#|~/.bash_logout  |    C      |           |      |
#+----------------+-----------+-----------+------+
# # # # # # # # # # # Z S H # # # # # # # # # # #
#+----------------+-----------+-----------+------+
#|                |Interactive|Interactive|Script|
#|                |login      |non-login  |      |
#+----------------+-----------+-----------+------+
#|/etc/zshenv     |    A      |    A      |  A   |
#+----------------+-----------+-----------+------+
#|~/.zshenv       |    B      |    B      |  B   |
#+----------------+-----------+-----------+------+
#|/etc/zprofile   |    C      |           |      |
#+----------------+-----------+-----------+------+
#|~/.zprofile     |    D      |           |      |
#+----------------+-----------+-----------+------+
#|/etc/zshrc      |    E      |    C      |      |
#+----------------+-----------+-----------+------+
#|~/.zshrc        |    F      |    D      |      |
#+----------------+-----------+-----------+------+
#|/etc/zlogin     |    G      |           |      |
#+----------------+-----------+-----------+------+
#|~/.zlogin       |    H      |           |      |
#+----------------+-----------+-----------+------+
#|                |           |           |      |
#+----------------+-----------+-----------+------+
#|                |           |           |      |
#+----------------+-----------+-----------+------+
#|~/.zlogout      |    I      |           |      |
#+----------------+-----------+-----------+------+
#|/etc/zlogout    |    J      |           |      |
#+----------------+-----------+-----------+------+
#Moral:
#	For bash, put stuff in ~/.bashrc, and make ~/.bash_profile source it.
#	For zsh, put stuff in ~/.zshrc, which is always executed.

##bash
cp ~/.bashrc ~/.bashrc.backup
cp ~/rfidquizgame/linux/bashrc.config ~/.bashrc
cp ~/.bash_profile ~/.bash_profile.backup
cp ~/rfidquizgame/linux/bashprofile.config ~/.bash_profile
##zsh
cp ~/.zshrc ~/.zshrc.backup
cp ~/rfidquizgame/linux/zshrc.config ~/.zshrc
#zshenv
if cat ~/.zshenv 2>/dev/null | grep "source ~/rfidquizgame/setup/envvars.sh"
	then
	echo "zshenv set up liao"
else
	echo "source ~/rfidquizgame/setup/envvars.sh" >> ~/.zshenv
fi
#PROGS
##vim
cp ~/.vimrc ~/.vimrc.backup
cp ~/rfidquizgame/linux/vimrc.config ~/.vimrc
##tmux
#create sym link to tmux config file
cp ~/.tmux.conf ~/.tmux.conf.backup
cp ~/rfidquizgame/linux/tmux_config.conf ~/.tmux.conf

echo "-->\nExit this shell session now, relogin and execute\nsource .zshrc"


