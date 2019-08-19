#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"



# Receive images
IMAGE_A=$1
IMAGE_B=$2
OUTPUT_NAME=$3
EXTENSION=$4

# STEP_SIZE_FLOAT=$(echo "100 / $STEPS" | bc -l)

# Slice

echo "Rendering $EXTENSION"

STEPS=50

for i in {0..50}
do
	NAME=$(echo "$OUTPUT_NAME-$i.$EXTENSION")
	echo "* Rendering slice $NAME"
	./binbyteslice.sh $IMAGE_A $IMAGE_B $i $NAME $EXTENSION 50
	convert $NAME -quality 100 $NAME.jpg
	# rm -f $NAME
done