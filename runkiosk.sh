#!/bin/sh


mkdir -p /tmp/kusr1
mkdir -p /tmp/kusr2



google-chrome --kiosk --user-data-dir=/tmp/kusr1 --window-position=1921,0 --disable-first-run-ui --no-default-browser-check --disable-translate --password-store=basic http://localhost:3000 &

# google-chrome --user-data-dir=/tmp/kusr1 --kiosk --window-position=0,0 --chrome-frame --disable-first-run-ui --no-default-browser-check --disable-translate --password-store=basic http://localhost:3000 &



google-chrome --kiosk --user-data-dir=/tmp/kusr2 --window-position=0,0 --disable-first-run-ui --no-default-browser-check --disable-translate --password-store=basic http://localhost:3000 &

# google-chrome --user-data-dir=/tmp/kusr2 --kiosk --window-position=1921,0 --chrome-frame --disable-first-run-ui --no-default-browser-check --disable-translate --password-store=basic http://localhost:3000 &

