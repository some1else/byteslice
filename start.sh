#!/usr/bin/env bash

sleep 10
echo Launching containers
sudo docker-compose up -d

sleep 10
echo Running kiosks
./runkiosk.sh &

sleep 10
echo Activating kiosks
./activate_kiosk.sh