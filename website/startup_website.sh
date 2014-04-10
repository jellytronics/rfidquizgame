#!/bin/bash

#restart services
#systemctl restart httpd.service

### NOTES
## Assumes that network settings is completed
## Conduct all website functions in ~/rfidquizstash/



NOW=$(date +"%m-%d-%Y-%T")

#create mongo db
if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "Hi Mac"
else
	systemctl enable mongodb
	systemctl start mongodb
fi



#create mongo shell (done through tmux script)





##IF IS MASTER == 0
# run client-side script


##ELSE
# run server-side script
cd ~/rfidquizstash
cp ~/rfidquizgame/website/server.js ~/rfidquizstash/website/server.js
echo " " >> ~/rfidquizstash/website/server/error_$NOW.log
node ~/rfidquizstash/website/server.js 2> ~/rfidquizstash/website/server/error_$NOW.log | tee ~/rfidquizstash/website/server/info_$NOW.log

