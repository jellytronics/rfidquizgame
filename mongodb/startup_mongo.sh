#!/bin/bash

#restart services
#systemctl restart httpd.service

### NOTES
## Assumes that network settings is completed
## Conduct all website functions in ~/rfidquizstash/


###CHECK THIS OUT
##http://scotch.io/tutorials/javascript/creating-a-single-page-todo-app-with-node-and-angular

mkdir ~/rfidquizstash
mkdir ~/rfidquizstash/mongodb

sleep 5

NOW=$(date +"%m-%d-%Y-%T")

#create mongo db
if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi Mac"
	mongo --host beagleserver --port 27017
	exit
else
	#don't need but I'll do it anyway.
	mongo --host beagleserver --port 27017
fi
