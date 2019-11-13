#!/usr/bin/env sh

WID=`xdotool search --name "React App"`
xdotool windowactivate --sync $WID
xdotool mousemove --sync 100 100 click 1
# xdotool key --sync --window $WID F11
