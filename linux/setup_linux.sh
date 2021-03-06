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

if ls ~/.oh-my-zsh 2>/dev/null | grep "custom"
	then
	echo "oh-my-zsh is installed"
else
	echo "installing oh-my-zsh"
	curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
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
	cd ~/rfidquizstash/linux/tmuxinator
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


#PROGS
##vim
cp ~/.vimrc ~/.vimrc.backup
cp ~/rfidquizgame/linux/vimrc.config ~/.vimrc
if cat ~/.vim/bundle/Vundle.vim/README.md >> /dev/null  2> /dev/null
	then
	echo "vundle installed"
else
	echo "installing vundle"
	git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
	#https://github.com/gmarik/Vundle.vim
fi
#install plugins
vim +PluginInstall +qall
##tmux
#create sym link to tmux config file
cp ~/.tmux.conf ~/.tmux.conf.backup
cp ~/rfidquizgame/linux/tmux_config.conf ~/.tmux.conf

##tmuxinator
mkdir ~/.tmuxinator
cp ~/rfidquizgame/linux/controller_main.yml ~/.tmuxinator/controller_main.yml
cp ~/rfidquizgame/linux/controller_node.yml ~/.tmuxinator/controller_node.yml
cp ~/rfidquizgame/linux/controller_server.yml ~/.tmuxinator/controller_server.yml
cp ~/rfidquizgame/linux/controller_webdev.yml ~/.tmuxinator/controller_webdev.yml

echo "-->\nExit this shell session now, relogin and execute\nsource .zshrc"
echo "also, if you are using a mac with terminal or iterm, change the startup shell to /bin/zsh!"
