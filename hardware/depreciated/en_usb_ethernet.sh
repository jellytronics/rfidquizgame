#!/bin/bash

sudo modprobe ftdi_sio vendor=0x0403 product=0xa6d0
echo "iface usb0 inet static" >> /etc/network/interfaces
modprobe g_ether

