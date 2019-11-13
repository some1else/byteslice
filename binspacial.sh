#!/bin/sh

while true; do
	curl http://$SERVER_HOST/run
	echo -n "\n";
	date;
	sleep 15;
done
