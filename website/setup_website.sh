#!/bin/bash

#https://wiki.archlinux.org/index.php/LAMP

#LAMP Linux, Apache, MySQL/MariaDB, and PHP.
#pacman -S apache php php-apache mariadb openssl

mkdir ~/rfidquizstash/
mkdir ~/rfidquizstash/website
mkdir ~/rfidquizstash/website/server
mkdir ~/rfidquizstash/mongo
mkdir ~/rfidquizstash/mongo/test


#Python
if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi Mac"
else
	pacman -S --needed python nodejs mongodb jre7-openjdk-headless jdk7-openjdk python-pip
	source /etc/profile
fi



######### NODEJS PACKAGES #############
##https://www.npmjs.org/package

cp -r ~/rfidquizgame/website ~/rfidquizstash

cd ~/rfidquizstash/website

##installation

npm install -g gulp path express cookie-parser express-session body-parser method-override morgan bcryptjs mongoose passport passport-local async request xml2js agenda sugar nodemailer lodash passport-facebook passport-google browser-sync nanotimer mongodb mongoskin grunt grunt-cli http-server bower socket.io daemon node-schedule express-generator
npm link gulp path express cookie-parser express-session body-parser method-override morgan bcryptjs mongoose passport passport-local async request xml2js agenda sugar nodemailer lodash passport-facebook passport-google browser-sync nanotimer mongodb mongoskin grunt grunt-cli http-server bower socket.io daemon node-schedule express-generator
