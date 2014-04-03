#!/bin/bash

echo "Installing embedded linux emulataion components"

if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi mac"'!'

	if hash qemu-system-arm 2> /dev/null
		then
		echo "qemu is installed"
	else
		brew install qemu
	fi

	if hash gtkwave 2> /dev/null
		then
		echo "gtkwave is insstalled"
	else
		brew install gtkwave
else
	echo "Hi Linux! installing  "
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get install qemu arm-linux-gnueabi-gcc
fi



if hash qemu-system-arm 2> /dev/null
	then
	echo "QEMU sucessfully installed!"
else
	echo "We are going to install the latest qemu binaries. HOLD ON TIGHT!"

	git clone git://git.qemu-project.org/qemu.git ~/rfidquizstash/embedded_linux/qemu

	#echo "this might be better for ARM based platforms..."
	#git clone git://git.linaro.org/qemu/qemu-linaro.git ~/rfidquizstash/embedded_linux/qemu

	cd ~/rfidquizstash/embedded_linux/qemu
	./configure --target-list=arm-softmmu,arm-linux-user
	make -j 2
	sudo make install

	echo "qemu-system-arm is installed"
	echo "Read more: http://www.cnx-software.com/2012/03/08/how-to-build-qemu-system-arm-in-linux/#ixzz2wwJCilq0"

fi

