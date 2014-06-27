#!/bin/bash

#http://xecdesign.com/qemu-emulating-raspberry-pi-the-easy-way/
#https://wiki.archlinux.org/index.php/QEMU

echo "Select options :-"

select choice in "Install QEMU Emulator" "Create new embedded linux image" "Emulate Embedded Linux Environments" "Run Qemu GUI" "Exit"; do
    case $choice in
        "Install QEMU Emulator" ) ~/rfidquizgame/embedded_linux/install_em_linux.sh;;
		"Create new Embedded Linux Image" ) ~/rfidquizgame/embedded_linux/create_image.sh;;
		"Emulate Embedded Linux Environments" ) ~/rfidquizgame/embedded_linux/emulate_image.sh;;
		"Run Qemu GUI" ) break;;
		"Exit" ) break;;
    esac
done

#http://www.raspberrypi.org/forums/viewtopic.php?f=78&t=54357

