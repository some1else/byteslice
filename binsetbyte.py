#!/usr/bin/env python3
#file: set-byte

import sys

fileName = sys.argv[1]
offset = int(sys.argv[2], 0)
byte = int(sys.argv[3], 0)

with open(fileName, "r+b") as fh:
    fh.seek(offset)
    fh.write(bytes([byte]))
