#!/bin/bash

#restart services
#systemctl restart httpd.service

### NOTES
## Assumes that network settings is completed
## Conduct all website functions in ~/rfidquizstash/


###CHECK THIS OUT
#https://github.com/jellyjellyrobot/mongodb-rest
#http://docs.mongodb.org/ecosystem/tools/http-interfaces/

cp ~/rfidquizgame/mongodb/rest_config.json ~/rfidquizstash/mongodb/config.json

sleep 10

NOW=$(date +"%m-%d-%Y-%T")

#create mongo db
if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi Mac"
	cd ~/rfidquizstash/mongodb/
	mongodb-rest
	exit
else
	#don't need but I'll do it anyway.
	cd ~/rfidquizstash/mongodb/
	mongodb-rest
fi
