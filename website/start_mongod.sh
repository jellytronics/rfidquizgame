#!/bin/bash

mongod -f ~/rfidquizstash/website/mongodb.conf --dbpath ~/rfidquizstash/mongodb/db --logpath ~/rfidquizstash/mongodb/mongodb_log_$NOW.log -vvvvv

## MongoDB ver 2.6 onwards
##mongod --config ~/rfidquizstash/website/mongodb.conf --dbpath ~/rfidquizstash/mongodb/db --logpath ~/rfidquizstash/mongodb/mongodb_log_$NOW.log -vvvvv