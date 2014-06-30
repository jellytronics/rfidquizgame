#!/bin/bash


mkdir ~/rfidquizstash
mkdir ~/rfidquizstash/mongodb
mkdir ~/rfidquizstash/mongodb/log
mkdir ~/rfidquizstash/mongodb/db
mkdir ~/rfidquizstash/mongodb/pid

NOW=$(date +"%m-%d-%Y-%T")

#create mongo db
if [[ $(sw_vers -productName) == *Mac* ]]
    then
    echo "Hi Mac"
    #not allowing mac to host DB
    ##mongod --config ~/rfidquizgame/mongodb/mongodb.conf
    echo "Mac don't need to host lol"
    exit
else
    #systemctl enable mongodb
    #systemctl start mongodb

    if hostname | grep "server"
        then
        echo "Okay Server, activating mongod"
        cd ~
        mongod --config ~/rfidquizgame/mongodb/mongodb.yml | tee ~/rfidquizstash/mongodb/log/$NOW.mongod.log
    else
        echo "oh this is not the server lol"
    fi

fi
