#!/bin/bash


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
