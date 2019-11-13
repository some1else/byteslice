#!/usr/bin/env bash

echo Archiving files
./archive.sh

sleep 10
echo Cleaning work directory
./reset.sh

sleep 10
echo Launching server, app, workers and kiosk
./start.sh