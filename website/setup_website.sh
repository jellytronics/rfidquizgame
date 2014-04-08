#!/bin/bash

#https://wiki.archlinux.org/index.php/LAMP

#LAMP Linux, Apache, MySQL/MariaDB, and PHP.
#pacman -S apache php php-apache mariadb openssl


#Python
pacman -S python python2 nodejs


######### NODEJS PACKAGES #############
##https://www.npmjs.org/package

cd ~/rfidquizstash

npm install mongodb
pacman -S mongodb
npm install mongoosem
npm install mongoskin


#Reveal.js
##refer to http://www.sitepoint.com/create-multi-user-presentation-reveal-js/
##https://github.com/slara/generator-reveal
npm install -g grunt-cli
npm install highlight.js
npm install –g generator-express
yo express
grunt
bower install reveal.js --save
##git clone https://github.com/hakimel/reveal.js.git ~/rfidquizstash/reveal.js
##cd ~/rfidquizstash/reveal.js
##npm install
#when presentation is ready, type the following
#grunt serve --port 8001
#http://localhost:8001
#https://github.com/hakimel/reveal.js


npm install async
npm install request
npm install underscore
npm install commander
npm install easyrtc





##FrontEnd and Backend Softwares

#TinyMCE
#https://github.com/tinymce/tinymce.git
if test -d ~/rfidquizstash/website/tinymce
	then

	NOW=$(date +"%m-%d-%Y %T")
	echo "Updating tinymce - $NOW"
	cd ~/rfidquizstash/website/tinymce
	git pull

else
	cd ~
	git clone git@bitbucket.org:jellyjellyrobot/rfidquizgame.git ~/rfidquizstash/website/tinymce

fi
	cd ~/rfidquizstash/website/tinymce
	npm i -g jake
	npm i
	jake

#WebRTC
#http://www.webrtc.org/reference/getting-started
##dependency for WebRTC
	#Depot tools -> git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
	#git

if test -d ~/rfidquizstash/website/depot_tools
	then
	#https://sites.google.com/a/chromium.org/dev/developers/how-tos/install-depot-tools
	NOW=$(date +"%m-%d-%Y %T")
	echo "Updating depot_tools - $NOW"
	cd ~/rfidquizstash/website/depot_tools
	git pull

else
	cd ~
	git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git ~/rfidquizstash/website/depot_tools
fi


#restart services
systemctl restart httpd.service