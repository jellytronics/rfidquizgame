#!/bin/bash


echo "INSTALLING TUTORIALS YEAHHHHH!!!!!!"


mkdir ~/rfidquizstash
mkdir ~/rfidquizstash/tutorials

cd ~/rfidquizstash/tutorials

echo "Installing node tutorials"
#Basics
npm install -g learnyounode
npm install -g stream-adventure
npm install -g bytewiser@latest
npm install -g functional-javascript-workshop@latest
npm install -g git-it@latest

#Electives
npm install -g levelmeup
npm install -g expressworks@latest
npm install -g promise-it-wont-hurt@latest
npm install -g async-you

echo "Visit the webpage @ http://nodeschool.io/"


echo "Installing angular tutorial"

cd ~/rfidquizstash/tutorials

git clone --depth=14 https://github.com/angular/angular-phonecat.git
##The --depth=14 option just tells Git to pull down only the last 14 commits. This makes the download much smaller and faster.
cd angular-phonecat

echo "visit the webpage @ https://docs.angularjs.org/tutorial"


<<DEPRECIATED

echo "Check this out! http://nodeschool.io/"


if cat ~/rfidquizstash/tutorials/expressworks/README.md 2> /dev/null
	then
	echo "expressworks installed"
else
	#git clone https://github.com/azat-co/expressworks ~/rfidquizstash/tutorials/expressworks
	echo "installing expressworks"
	cd ~/rfidquizstash
	npm install -g expressworks
	npm install expressworks

	expressworks
fi

echo ""
echo "Start expressworks to learn more about expressjs"

DEPRECIATED
