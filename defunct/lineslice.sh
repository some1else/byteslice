#!/bin/bash

# Receive progress percentage
PROGRESS=50

# Receive output
OUTPUT=result.tif

# Receive images
IMAGE_A=image-A.tif
IMAGE_B=image-B.tif

# Obtain number of lines in images
TOTAL_LINES_A=$(wc -l $IMAGE_A | awk '{print $1}')
TOTAL_LINES_B=$(wc -l $IMAGE_B | awk '{print $1}')

# Determine number of lines for image A
IMAGE_A_LINES_RESULT=$(echo "$TOTAL_LINES_A * $PROGRESS / 100" | bc -l)
IMAGE_A_LINES_FLOAT=$(printf %.2f $(echo "$IMAGE_A_LINES_RESULT" | bc -l))
IMAGE_A_LINES=$(echo "$IMAGE_A_LINES_FLOAT" | rev | cut -c4- | rev)

# Determine number of lines for image B
IMAGE_B_SKIP_RESULT=$(echo "$TOTAL_LINES_B * $PROGRESS / 100" | bc -l)
IMAGE_B_SKIP_FLOAT=$(printf %.2f $(echo "$IMAGE_B_SKIP_RESULT" | bc -l))
IMAGE_B_SKIP=$(echo "$IMAGE_B_SKIP_FLOAT" | rev | cut -c4- | rev)
IMAGE_B_LINES_RESULT=$(echo "$TOTAL_LINES_B * (100 - $PROGRESS) / 100" | bc -l)
IMAGE_B_LINES_FLOAT=$(printf %.2f $(echo "$IMAGE_B_LINES_RESULT" | bc -l))
IMAGE_B_LINES=$(echo "$IMAGE_B_LINES_FLOAT" | rev | cut -c4- | rev)

echo "Total lines in IMAGE_A: 		$TOTAL_LINES_A"
echo "Sliced lines from IMAGE_A: 		$IMAGE_A_LINES"

echo "Total lines in IMAGE_B: 		$TOTAL_LINES_B"
echo "Skipped lines in IMAGE_B: 		$IMAGE_B_SKIP"
echo "Sliced lines from IMAGE_B: 		$IMAGE_B_LINES"

# Slice A image

LINES_TO_COPY_A=$IMAGE_A_LINES

echo "Copying $LINES_TO_COPY_A lines from IMAGE_A"

OUTPUT_A=slice-A.tif

# dd if=$IMAGE_A bs=$LINES_TO_COPY_A count=1 > $OUTPUT_A

cat $IMAGE_A | head -n $LINES_TO_COPY_A > $OUTPUT_A

# Slice B image

LINES_TO_SKIP_B=$IMAGE_B_SKIP
LINES_TO_COPY_B=$IMAGE_B_LINES

echo "Copying last $LINES_TO_COPY_B lines from IMAGE_B"

OUTPUT_B=slice-B.tif

# dd if=$IMAGE_B bs=$LINES_TO_SKIP_B skip=1 | dd bs=$LINES_TO_COPY_B count=1 > $OUTPUT_B

# dd if=$IMAGE_B bs=$LINES_TO_SKIP_B skip=1  > $OUTPUT_B

cat $IMAGE_B | tail -n $LINES_TO_COPY_B > $OUTPUT_B

# Merge images

echo "Merging images"

cat $OUTPUT_A $OUTPUT_B > $OUTPUT




























