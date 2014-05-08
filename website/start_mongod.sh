#!/bin/bash

NOW=$(date +"%m-%d-%Y-%T")

cd ~/rfidquizstash
cp ~/rfidquizgame/website/mongodb.conf ~/rfidquizstash/website/mongodb.conf
cp ~/rfidquizgame/website/mongodb.yml ~/rfidquizstash/website/mongodb.yml

mongod -f ~/rfidquizstash/website/mongodb.conf --dbpath ~/rfidquizstash/mongodb/db --logpath ~/rfidquizstash/mongodb/mongodb_log_$NOW.log -vvvvv

## MongoDB ver 2.6 onwards
##mongod --config ~/rfidquizstash/website/mongodb.yml --dbpath ~/rfidquizstash/mongodb/db --logpath ~/rfidquizstash/mongodb/mongodb_log_$NOW.log -vvvvv