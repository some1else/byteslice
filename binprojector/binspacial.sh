#!/bin/sh

while true; do
	curl http://localhost:3001
	echo -n "\n";
	date;
	sleep 20;
done