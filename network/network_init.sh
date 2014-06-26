#!/bin/bash



## Script to run everytime

echo "Stopping DHCP cilent"
systemctl stop dhcpcd.service

ip link set eth0 up
ip addr add 192.168.2.2/256 dev eth0
ip route add default via 192.168.2.1

## File to edit

# nano /etc/resolv.conf
#nameserver 61.23.173.5
#nameserver 61.95.849.8
#search example.com


