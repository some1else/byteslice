#!/usr/bin/env bash

rm -f dump.rdb

rm -rf files
mkdir files
mkdir files/scraped
touch files/scraped/.gitkeep
mkdir files/imported
touch files/imported/.gitkeep
mkdir files/sliced
touch files/sliced/.gitkeep

docker-compose up
