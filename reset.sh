#!/usr/bin/env bash

sudo rm -rf .data

sudo rm -rf files

mkdir files
mkdir files/scraped
touch files/scraped/.gitkeep
mkdir files/imported
touch files/imported/.gitkeep
mkdir files/sliced
touch files/sliced/.gitkeep
