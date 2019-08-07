#!/bin/bash

# Receive progress percentage
PROGRESS=50

# Receive output
OUTPUT=result.tif

# Receive images
IMAGE_A=image-A.tif
IMAGE_B=image-B.tif

# Obtain number of bytes in images
TOTAL_BYTES_A=$(wc -c $IMAGE_A | awk '{print $1}')
TOTAL_BYTES_B=$(wc -c $IMAGE_B | awk '{print $1}')

# Determine number of bytes for image A
IMAGE_A_BYTES_RESULT=$(echo "$TOTAL_BYTES_A * $PROGRESS / 100" | bc -l)
IMAGE_A_BYTES_FLOAT=$(printf %.2f $(echo "$IMAGE_A_BYTES_RESULT" | bc -l))
IMAGE_A_BYTES=$(echo "$IMAGE_A_BYTES_FLOAT" | rev | cut -c4- | rev)

# Determine number of bytes for image B
IMAGE_B_SKIP_RESULT=$(echo "$TOTAL_BYTES_B * $PROGRESS / 100" | bc -l)
IMAGE_B_SKIP_FLOAT=$(printf %.2f $(echo "$IMAGE_B_SKIP_RESULT" | bc -l))
IMAGE_B_SKIP=$(echo "$IMAGE_B_SKIP_FLOAT" | rev | cut -c4- | rev)
IMAGE_B_BYTES_RESULT=$(echo "$TOTAL_BYTES_B * (100 - $PROGRESS) / 100" | bc -l)
IMAGE_B_BYTES_FLOAT=$(printf %.2f $(echo "$IMAGE_B_BYTES_RESULT" | bc -l))
IMAGE_B_BYTES=$(echo "$IMAGE_B_BYTES_FLOAT" | rev | cut -c4- | rev)

echo "Total bytes in IMAGE_A: 		$TOTAL_BYTES_A"
echo "Sliced bytes from IMAGE_A: 		$IMAGE_A_BYTES"

echo "Total bytes in IMAGE_B: 		$TOTAL_BYTES_B"
echo "Skipped bytes in IMAGE_B: 		$IMAGE_B_SKIP"
echo "Sliced bytes from IMAGE_B: 		$IMAGE_B_BYTES"

# Slice A image

BYTES_TO_COPY_A=$IMAGE_A_BYTES

echo "Copying $BYTES_TO_COPY_A bytes from IMAGE_A"

OUTPUT_A=slice-A.tif

dd if=$IMAGE_A bs=$BYTES_TO_COPY_A count=1 > $OUTPUT_A

# Slice B image

BYTES_TO_SKIP_B=$IMAGE_B_SKIP
BYTES_TO_COPY_B=$IMAGE_B_BYTES

echo "Skipping $BYTES_TO_SKIP_B, copying $BYTES_TO_COPY_B bytes from IMAGE_B"

OUTPUT_B=slice-B.tif

# dd if=$IMAGE_B bs=$BYTES_TO_SKIP_B skip=1 | dd bs=$BYTES_TO_COPY_B count=1 > $OUTPUT_B

dd if=$IMAGE_B bs=$BYTES_TO_SKIP_B skip=1  > $OUTPUT_B

# Merge images

echo "Merging images"

cat $OUTPUT_A $OUTPUT_B > $OUTPUT




























