#!/bin/bash

#restart services
#systemctl restart httpd.service

##Conduct all website functions in ~/rfidquizstash/



NOW=$(date +"%m-%d-%Y %T")

#create mongo db

systemctl enable mongodb
systemctl start mongodb
cd ~/rfidquizstash
cp ~/rfidquizgame/network/mongodb.conf ~/rfidquizstash/network/mongodb.conf
mongod -f ~/rfidquizstash/network/mongodb.conf --fork

#create mongo shell





##IF IS MASTER == 0
# run client-side script


##ELSE
# run server-side script
cd ~/rfidquizstash
cp ~/rfidquizgame/network/server.js ~/rfidquizstash/network/server.js
node ~/rfidquizstash/network/server.js 2> ~/rfidquizstash/network/server/error-$NOW.log | tee ~/rfidquizstash/network/server/info-$NOW.log

