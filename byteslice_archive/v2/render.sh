#!/bin/bash

# Receive images
IMAGE_A=$1
IMAGE_B=$2
OUTPUT_NAME=$3
EXTENSION=$4

# STEPS=$5
# STEP_SIZE_FLOAT=$(echo "100 / $STEPS" | bc -l)

# Slice

echo "My favourite exteions is $EXTENSION"

for i in {0..100}
do
	NAME=$(echo "$OUTPUT_NAME-$i.$EXTENSION")
	echo "* Rendering slice $NAME"
	./byteslice.sh $IMAGE_A $IMAGE_B $i $NAME $EXTENSION
	convert $NAME $NAME.png
done