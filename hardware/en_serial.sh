#!/bin/bash

#echo "info gotten from"
#echo "http://www.armhf.com/beaglebone-black-serial-uart-device-tree-overlays-for-ubuntu-and-debian-wheezy-tty01-tty02-tty04-tty05-dtbo-files/"

#ls /dev/ttyO*

#cd /lib/firmware
#ls -l BB-UART*
#cd ~

echo BB-UART1 > /sys/devices/bone_capemgr*/slots
#echo BB-UART2 > /sys/devices/bone_capemgr*/slots
#echo BB-UART4 > /sys/devices/bone_capemgr*/slots
#echo BB-UART5 > /sys/devices/bone_capemgr*/slots

#echo "consult this as well!"
#echo "http://nfc-tools.org/index.php?title=Libnfc:configuration"


##vim /etc/nfc/libnfc.conf
##export LIBNFC_INTRUSIVE_SCAN=yes

##INIT SETUP

#mkdir /etc/nfc
#echo "allow_autoscan = false" > /etc/nfc/libnfc.conf
#echo "allow_intrusive_scan = false" >> /etc/nfc/libnfc.conf
#echo "log_level = 1" >> /etc/nfc/libnfc.conf
#echo "" >> /etc/nfc/libnfc.conf
#echo "device.name = \"nfcnode1\"" >> /etc/nfc/libnfc.conf
#echo "device.connstring = \"pn532_uart:/dev/ttyO1\"" >> /etc/nfc/libnfc.conf

#ls /dev/ttyO*