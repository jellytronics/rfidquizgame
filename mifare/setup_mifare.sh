#!/bin/bash

echo "Installing Libnfc and Mifare Tools"

if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi Mac!"
	sudo chown -R $USER /usr/local
	brew install autoconf doxygen
	brew install automake libtool
	brew install libusb libusb-compat --universal
	brew install wget pkgconfig
	xcode-select --install
	if [[ $1 == "-f" ]]
		then
		echo "\nI assume that you have installed FTDI Drivers yeah...\nProceeding with installation\n\n\n"
	else
		echo "\n\n\nPLEASE sINSTALL FTDI DRIVERS TO CONTINUE\n\nGet from http://www.ftdichip.com/Drivers/VCP/MacOSX/FTDIUSBSerialDriver_v2_2_18.dmg"
		exit
	fi
else
	if uname -a | grep "ARCH"
		then
		pacman -S --needed libusb libusb-compat doxygen pcsclite
	else
		echo "Installing Libnfc with apt-get"
		sudo apt-get install libusb-dev libpcsclite-dev -y
		sudo apt-get install libusb-0.1-4 libpcsclite1 libccid pcscd libftdi1 -y
	fi

fi

export PKG_CONFIG_PATH=$(which pkg-config):/usr/local/lib/pkgconfig

#Past code below under mac_obsolete

##http://www.jerome-bernard.com/blog/2013/04/15/how-to-connect-adafruit-nfc-shield-to-a-mac-via-libnfc/
##http://commy.dk/post/50418110584/pn532-libnfc-mfoc-with-osx


###LIBNFC
mkdir ~/rfidquizstash
mkdir ~/rfidquizstash/Mifare

cd ~/rfidquizstash/Mifare

#OLD STUFF ---> http://commy.dk/post/50418110584/pn532-libnfc-mfoc-with-osx
#wget http://dl.bintray.com/nfc-tools/sources/libnfc-1.7.1.tar.bz2
#tar xzvf libnfc-1.7.1.tar.bz2
#cd ~/rfidquizstash/Mifare/libnfc-1.7.1

git clone https://code.google.com/p/libnfc/ ~/rfidquizstash/Mifare/libnfc
cd ~/rfidquizstash/Mifare/libnfc
./make_release.sh
autoreconf -vis
./configure --enable-doc --with-drivers=all --sysconfdir=/etc --prefix=/usr

##http://www.nolanbrown.com/howto/2012/08/28/libnfc-install/
#./configure --enable-doc --with-drivers=pn532_uart --enable-serial-autoprobe
##vi utils/nfc-mfclassic.c


##uninstall -> http://www.libnfc.org/community/topic/915/problem-mfoc0105-with-libnfc170rc4-on-raspberry-pi/

##TO_DO use sed to automate this part!
echo "\n\n\n\n\n-----------------\n\nComment out following two lines if anything goes wrong"
echo "if (uiBlock == 0 && ! write_block_zero && ! magic2)"
echo "\tcontinue;"
echo "\n\naccess file here --> "
echo "vim utils/nfc-mfclassic.c"
echo "\nif all else fails try https://bintray.com/nfc-tools/sources/libnfc/_latestVersion\n\n"
echo "\n\ninstalling software\n\n"


echo "add \nsleep(4)\nas stated here"
echo "int
pn532_uart_wakeup(nfc_device *pnd)
{
  /* High Speed Unit (HSU) wake up consist to send 0x55 and wait a \"long\" delay for PN532 being wakeup. */
  const uint8_t pn532_wakeup_preamble[] = { 0x55, 0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
  int res = uart_send(DRIVER_DATA(pnd)->port, pn532_wakeup_preamble, sizeof(pn532_wakeup_preamble), 0);
  CHIP_DATA(pnd)->power_mode = NORMAL; // PN532 should now be awake
  sleep(4); //here
  return res;
}"
echo "\n\n\nvim libnfc/drivers/pn532_uart.c\n"

make clean all
make
sudo make install
make doc


## Setting environment variables

if [[ $(sw_vers -productName) == *Mac* ]]
	then
	#ls -la /dev/tty.usbserial*
	#sudo vim /usr/local/etc/nfc/devices.d/pn532_uart.conf
	mkdir /usr/local/etc/nfc/
	mkdir /usr/local/etc/nfc/devices.d/
	sudo mkdir /etc/nfc
	sudo mkdir /etc/nfc/devices.d
	#sudo echo "name = \"PN532 board via UART\"" > /usr/local/etc/nfc/devices.d/pn532_uart.conf
	#sudo echo "connstring = pn532_uart:/dev/"$(ls /dev | grep tty.usbserial) >> /usr/local/etc/nfc/devices.d/pn532_uart.conf
	sudo echo "" > /usr/local/etc/nfc/devices.d/pn532_uart.conf
	sudo echo "allow_autoscan = false" > /usr/local/etc/nfc/libnfc.conf
	sudo echo "allow_intrusive_scan = false" >> /usr/local/etc/nfc/libnfc.conf
	sudo echo "log_level=1" >> /usr/local/etc/nfc/libnfc.conf
	sudo echo "device.name = \"PN532 board via UART\"" >> /usr/local/etc/nfc/libnfc.conf
	sudo echo "device.connstring = \"pn532_uart:/dev/"$(ls /dev | grep tty.usbserial)\" >> /usr/local/etc/nfc/libnfc.conf
	sudo cp /usr/local/etc/nfc/libnfc.conf /etc/nfc/libnfc.conf
	sudo cp /usr/local/etc/nfc/devices.d/pn532_uart.conf /etc/nfc/devices.d/pn532_uart.conf
else
	sudo mkdir /etc/nfc/
	sudo echo "allow_autoscan = false" > /etc/nfc/libnfc.conf
	sudo echo "allow_intrusive_scan = false" >> /etc/nfc/libnfc.conf
	sudo echo "log_level=1" >> /etc/nfc/libnfc.conf
	sudo echo "device.name=\"PN532 board via UART\"" >> /etc/nfc/libnfc.conf
	sudo echo "device.connstring = pn532_uart:/dev/ttyO1 #"$(ls /dev | grep tty.usbserial) >> /etc/nfc/libnfc.conf
fi






###LIBFREEFARE
cd ~/rfidquizstash/Mifare
git clone https://code.google.com/p/libfreefare/ ~/rfidquizstash/Mifare/libfreefare
cd ~/rfidquizstash/Mifare/libfreefare
autoreconf -vis
./configure --prefix=/usr/
make
sudo make install


###MFOC
cd ~/rfidquizstash/Mifare
#git clone https://code.google.com/p/mfoc/ ~/rfidquizstash/Mifare/mfoc
wget https://mfoc.googlecode.com/files/mfoc-0.10.7.tar.bz2
tar xzvf mfoc-0.10.7.tar.bz2
cd ~/rfidquizstash/Mifare/mfoc-0.10.7/
./configure LDFLAGS=-L/usr/local/lib PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
#./configure LDFLAGS=-L/usr/local/lib PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
#echo "vim src/nfc-utils.c"
make
sudo make install



##install node libraries
cd ~/rfidquizstash
npm install -g ndef
npm install -g mifare-classic
npm link ndef
npm link mifare-classic
#npm install -g nfc
#npm install rfid-pn532
#npm install -g rfid-pn532
#npm link rfid-pn532

##My own node js library yoz!
cd ~/rfidquizstash/Mifare


##install nfc js handler
cp ~/rfidquizgame/mifare/nfc_handler.js ~/rfidquizstash/Mifare/nfc_handler.js


<<OBSOLETE


echo "Installing Libnfc and Mifare Tools"

if [[ $(sw_vers -productName) == *Mac* ]]
	then

	echo "Installing Libnfc for mac"

	if hash libnfc 2>/dev/null
		then
		echo "libnfc is installed"
	else
		echo "Installing libnfc on brew"
		brew install libusb libusb-compat --universal
		brew install libnfc
	fi

	if hash libfreefare 2>/dev/null
		then
		echo "libfreefare is installed"
	else
		echo "Installing libfreefare on brew"
		brew install libfreefare
	fi

elif uname -a | grep "ARCH"
	then
	pacman -S --needed libusb libusb-compat doxygen
else
	echo "Installing Libnfc with apt-get"
	sudo apt-get install libusb-dev libpcsclite-dev -y
	sudo apt-get install libusb-0.1-4 libpcsclite1 libccid pcscd libftdi1 -y

fi

export PKG_CONFIG_PATH=$(which pkg-config):/usr/local/lib/pkgconfig

if hash libnfc 2>/dev/null
then
	echo "libnfc is already installed"
else
	#git submodule add https://code.google.com/p/libnfc/ ~/jellythings/Experiments/Mifare/libnfc

	echo "Installing libnfc"
	git clone https://code.google.com/p/libnfc/ ~/rfidquizstash/mifare/libnfc
	cd ~/rfidquizstash/mifare/libnfc
	autoreconf -vis
	./configure --enable-doc
	make
	sudo make install
	make doc

fi


if hash libfreefare 2>/dev/null
then
	echo "libfreefare is already installed"
else
	#https://code.google.com/p/libfreefare/
	#git submodule add https://code.google.com/p/libfreefare/ ~/jellythings/Experiments/Mifare/libfreefare
	git clone https://code.google.com/p/libfreefare/ ~/rfidquizstash/mifare/libfreefare
	echo "Installing libfreefare"
	cd ~/rfidquizstash/mifare/libfreefare
	autoreconf -vis
	./configure --prefix=/usr
	make
	CFLAGS="-g -Wall -pedantic -O0 -ggdb" ./configure --prefix=/usr
	make clean all
	sudo make install
fi




echo "From here on out, these projects are not longer FEATURED"

if hash libllcp 2>/dev/null
then
	echo "libllcp is already installed"
else
	#http://nfc-tools.org/index.php?title=Libllcp
	#git submodule add https://code.google.com/p/libllcp/ ~/jellythings/Experiments/Mifare/libllcp
	git clone https://code.google.com/p/libllcp/ ~/rfidquizstash/mifare/libllcp
	echo "Installing libllcp"
	cd ~/rfidquizstash/mifare/libllcp
	autoreconf --force --install
	./configure --prefix=/usr
	make
	sudo make install
fi


if hash lsnfc 2>/dev/null
then
	echo "lsnfc is already installed"
else
	#http://nfc-tools.org/index.php?title=Lsnfc
	echo "Installing lsnfc"
	cd ~/rfidquizstash/mifare
	svn checkout http://nfc-tools.googlecode.com/svn/trunk/nfcutils ~/rfidquizstash/mifare/nfcutils
	cd nfcutils
	autoreconf -vis
	./configure
	make
	make install
	cd ~/jellythings
fi


if hash libndef 2>/dev/null
then
	echo "libndef is already installed"
else
	#https://github.com/nfc-tools/libndef/blob/master/INSTALL
	#https://code.google.com/p/libndef/
	#git submodule add https://github.com/nfc-tools/libndef.git ~/jellythings/Experiments/Mifare/libndef
	git clone https://github.com/nfc-tools/libndef.git ~/rfidquizstash/mifare/libndef
	echo "Installing libndef"
	cd ~/rfidquizstash/mifare/libndef
	qmake
	make
	sudo make install
fi


if hash mfoc 2>/dev/null
then
	echo "mfoc is already installed"
else
	#https://code.google.com/p/mfoc/source/checkout
	#git submodule add https://code.google.com/p/mfoc/ ~/jellythings/Experiments/Mifare/mfoc
	git clone https://code.google.com/p/mfoc/ ~/rfidquizstash/mifare/mfoc
	echo "Installing mfoc"
	echo "Work in progress sorry for the hiccups"
	cd ~/rfidquizstash/mifare/mfoc
	make
	sudo make install
fi

if pydoc modules 2>/dev/null | grep "rfidiot"
	then
	echo "rfidiot"
else
	echo "Installing rfidiot"
	#https://github.com/AdamLaurie/RFIDIOt
	#http://adamsblog.aperturelabs.com/
	#git submodule add https://github.com/AdamLaurie/RFIDIOt.git ~/jellythings/Experiments/Mifare/RFIDIOt
	git clone https://github.com/AdamLaurie/RFIDIOt.git ~/rfidquizstash/mifare/RFIDIOt
	cd ~/rfidquizstash/mifare/RFIDIOt
	sudo python ./setup.py install
fi

OBSOLETE



cd ~
