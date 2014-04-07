#!/bin/bash

#This script repairs git archives that has more than 100Mb files.

if cat ~/rfidquizstash/bfg-repo-cleaner/README.md 2>/dev/null
	then
	echo "bfg is installed"
else
	echo "installing bfg"
	git clone https://github.com/rtyley/bfg-repo-cleaner.git ~/rfidquizstash/bfg-repo-cleaner