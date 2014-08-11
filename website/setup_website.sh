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

cd ~/rfidquizstash/website

##installation

npm install -g mongodb
npm install -g mongoose
npm install -g mongoskin
npm install -g bonescript
npm install -g grunt
npm install -g grunt-cli
npm install -g bower
npm install -g http-server
npm install -g socket.io
npm install -g express
npm install -g meanio
npm install -g daemon
npm install -g node-schedule
npm install -g express-generator
npm install -g cookie-parser
npm install -g morgan path body-parser
sudo npm install -g gulp

##Linking

npm link mongodb
npm link mongoose
npm link mongoskin
npm link bonescript
npm link grunt
npm link grunt-cli
npm link bower
npm link http-server
npm link socket.io
npm link express
npm link daemon
npm link node-schedule
npm link cookie-parser
npm link morgan path body-parser


## Do This at website folder not here
npm install --save-dev gulp gulp-sass gulp-plumber
npm install --save mongoose bcryptjs
npm install --save async request xml2js lodash
npm link morgan path body-parser



##Bower install
bower install

cd ~/rfidquizstash/website

##Reveal installation
git clone https://github.com/hakimel/reveal.js.git ~/rfidquizstash/website/reveal.js
cd ~/rfidquizstash/website/reveal.js
npm install

##Meteor install
#curl https://install.meteor.com/ | sh
#npm install -g meteorite
##Not ported to arm7l yet

##Run Server
#grunt serve --port=9000


#Build Angular JS
#https://docs.angularjs.org/misc/contribute
cd ~/rfidquizstash/website/

git clone https://github.com/angular/angular.js ~/rfidquizstash/website/angular

cd ~/rfidquizstash/website/angular

# Install node.js dependencies:
npm install

# Install bower components:
bower install --allow-root

# Build AngularJS:
grunt package
