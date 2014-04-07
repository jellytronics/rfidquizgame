#!/bin/bash

#http://xecdesign.com/qemu-emulating-raspberry-pi-the-easy-way/
#https://wiki.archlinux.org/index.php/QEMU
#http://www.raspberrypi.org/forums/viewtopic.php?f=78&t=54357

echo "Emulating Image"

echo "Select platform to emulate"

select choice in "Raspberry Pi" "Beaglebone Black" "Exit"; do
    case $choice in
        "Raspberry Pi" ) ;;
		"Beaglebone Black" ) ;;
		"Exit" ) break;;
    esac
done