#!/usr/bin/env bash

echo Archiving files
./archive.sh

sleep 10
echo Cleaning work directory
./reset.sh

sleep 10
echo Launching containers
sudo docker-compose up -d

sleep 10
echo Running kiosk
./runkiosk.sh

sleep 10
echo Activating kiosk
./activate_kiosk.sh