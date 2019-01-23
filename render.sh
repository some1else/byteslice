#!/bin/bash

# Receive images
IMAGE_A=$1
IMAGE_B=$2
OUTPUT_NAME=$3
STEPS=$4
STEP_SIZE_FLOAT=$(echo "100 / $STEPS" | bc -l)

# Slice

for i in {1..100}
do
	NAME=$(echo "$OUTPUT_NAME-$i.jpg")
	echo "* Rendering slice $NAME"
	./byteslice.sh $IMAGE_A $IMAGE_B $i $NAME
done