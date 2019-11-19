#!/usr/bin/env bash

echo Archiving files
./archive.sh

echo Cleaning work directory
./reset.sh

echo Running containers
docker-compose up -d

echo Waiting four hours
sleep 3600
echo Restarting scraper
docker-compose restart scraper
echo Waiting three hours
sleep 3600
echo Restarting scraper
docker-compose restart scraper
echo Waiting two hours
sleep 3600
echo Restarting scraper
docker-compose restart scraper
echo Waiting one hour
sleep 3600

echo Stopping containers
docker-compose stop

echo Restarting server, app and kiosk
sudo shutdown -r now