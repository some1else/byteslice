#!/bin/bash

# https://stackoverflow.com/questions/4783657/cli-write-byte-at-address-hexedit-modify-binary-from-the-command-line
printf "$(printf '\\x%02X' $4)" | dd of="$1" bs=1 seek=$2 count=$3 conv=notrunc &> /dev/null
