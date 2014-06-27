#!/bin/bash

#to run mongod without config

sudo mkdir -p /data
sudo mkdir -p /data/db
sudo chown `id -u` /data/db

#to run mongod with config

mkdir ~/rfidquizstash/mongodb/
mkdir ~/rfidquizstash/mongodb/db
mkdir ~/rfidquizstash/website/
