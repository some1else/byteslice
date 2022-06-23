#!/bin/bash

# https://stackoverflow.com/questions/4783657/cli-write-byte-at-address-hexedit-modify-binary-from-the-command-line
function replaceByte() {
    printf "$(printf '\\x%02X' $3)" | dd of="$1" bs=1 seek=$2 count=1 conv=notrunc &> /dev/null
}

# Receive images
INPUT_A=$1
INPUT_B=$2

# Receive progress percentage
PROGRESS=$3

# Receive output file name
OUTPUT_FILE=$4

# Recieve extension
EXTENSION=$5


STEPS=$6

# IMAGE_A=$(echo "$INPUT_A.$EXTENSION")
# IMAGE_B=$(echo "$INPUT_B.$EXTENSION")

IMAGE_A=$1
IMAGE_B=$2

# CONF=""
# convert $INPUT_A $CONF $IMAGE_A
# convert $INPUT_B $CONF $IMAGE_B

# Obtain number of BYTES in images
TOTAL_BYTES_A=$(wc -c $IMAGE_A | awk '{print $1}')
TOTAL_BYTES_B=$(wc -c $IMAGE_B | awk '{print $1}')

# Determine number of BYTES for image A
IMAGE_A_BYTES_RESULT=$(echo "(($TOTAL_BYTES_A - 2) * $PROGRESS / $STEPS) + 2" | bc -l)
IMAGE_A_BYTES_FLOAT=$(printf %.2f $(echo "$IMAGE_A_BYTES_RESULT" | bc -l))
IMAGE_A_BYTES=$(echo "$IMAGE_A_BYTES_FLOAT" | rev | cut -c4- | rev)

# Determine number of BYTES for image B
IMAGE_B_SKIP_RESULT=$(echo "($TOTAL_BYTES_B - 2) * $PROGRESS / $STEPS" | bc -l)
IMAGE_B_SKIP_FLOAT=$(printf %.2f $(echo "$IMAGE_B_SKIP_RESULT + 2" | bc -l))
IMAGE_B_SKIP=$(echo "$IMAGE_B_SKIP_FLOAT" | rev | cut -c4- | rev)
IMAGE_B_BYTES_RESULT=$(echo "($TOTAL_BYTES_B * ($STEPS - $PROGRESS) / $STEPS)" | bc -l)
IMAGE_B_BYTES_FLOAT=$(printf %.2f $(echo "$IMAGE_B_BYTES_RESULT" | bc -l))
IMAGE_B_BYTES=$(echo "$IMAGE_B_BYTES_FLOAT" | rev | cut -c4- | rev)

echo "Total BYTES in $IMAGE_A: 		$TOTAL_BYTES_A"
echo "Sliced BYTES from $IMAGE_A: 		$IMAGE_A_BYTES"

echo "Total BYTES in $IMAGE_B: 		$TOTAL_BYTES_B"
echo "Skipped BYTES in $IMAGE_B: 		$IMAGE_B_SKIP"
echo "Sliced BYTES from $IMAGE_B: 		$IMAGE_B_BYTES"

# Slice A image

BYTES_TO_COPY_A=$IMAGE_A_BYTES

echo "Copying $BYTES_TO_COPY_A BYTES from $IMAGE_A"

OUTPUT_FILE_A=$(echo ".slice-A-$PROGRESS.$EXTENSION")

cat $IMAGE_A | head -c $BYTES_TO_COPY_A > $OUTPUT_FILE_A

# Slice B image

BYTES_TO_SKIP_B=$IMAGE_B_SKIP
BYTES_TO_COPY_B=$IMAGE_B_BYTES

echo "Copying last $BYTES_TO_COPY_B BYTES from $IMAGE_B"

OUTPUT_FILE_B=$(echo ".slice-B-$PROGRESS.$EXTENSION")

cat $IMAGE_B | tail -c $BYTES_TO_COPY_B > $OUTPUT_FILE_B

# Merge images

OUTPUT_FINAL=$(echo "stitched-$PROGRESS.$EXTENSION")

echo "Merging images & cleaning up $OUTPUT_FINAL"

cat $OUTPUT_FILE_A $OUTPUT_FILE_B > $OUTPUT_FINAL

convert $OUTPUT_FINAL $OUTPUT_FILE

rm -f $OUTPUT_FILE_A
rm -f $OUTPUT_FILE_B
rm -f $OUTPUT_FINAL




























