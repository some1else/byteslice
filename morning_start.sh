#!/usr/bin/env bash

echo Stopping containers
/usr/local/bin/docker-compose stop

echo Archiving files
./archive.sh

echo Cleaning work directory
./reset.sh

echo Running containers
/usr/local/bin/docker-compose up -d

echo Waiting four hours
sleep 3600

echo Restarting scraper
/usr/local/bin/docker-compose restart scraper

echo Waiting three hours
sleep 3600

echo Restarting scraper
/usr/local/bin/docker-compose restart scraper

echo Waiting two hours
sleep 3600

echo Restarting scraper
/usr/local/bin/docker-compose restart scraper

echo Waiting one hour
sleep 3600

echo Stopping containers
/usr/local/bin/docker-compose  stop

echo Restarting server, app and kiosk
sudo shutdown -r now
