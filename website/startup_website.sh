#!/bin/bash

#restart services
#systemctl restart httpd.service

NOW=$(date +"%m-%d-%Y %T")

mongod -f ~/rfidquizgame/network/mongodb.conf

node ~/rfidquizgame/network/server.js 2> ~/rfidquizstash/network/server/error-$NOW.log | tee ~/rfidquizstash/network/server/info-$NOW.log