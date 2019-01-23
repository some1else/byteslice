# Byteslice prototype

Slice TIFF images

## Requirements


Install [Homebrew](https://brew.sh):

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install ImageMagick (The `convert` command from ImageMagick helps correct broken stitched results):

```
brew install imagemagick
```

## Usage

### First: Change to the correct folder in Terminal

Open Finder and go to the folder that contains A and B images.

Open Terminal and type in `cd `. Make sure to leave the space

Drag the folder that cointains A and B images after the `cd `.

Press enter (i.e.: `cd /Users/s1e/Pictures/tiff_glitch_test`)

### Function 1: Slice two images, A 72%, B 28%

Syntax: `./byteslice.sh <image-A> <image-B> <percentage> <image-result>`

	`image-A`, `image-B` - TIFF image
	`percentage` - 1..100
	`image-result` - JPG or PNG image

Example:

```
./byteslice.sh image-a.tif image-b.tif 72 blend-72.jpg
```

### Function 2: Render a hundred slices

Syntax: `./render.sh <image-A> <image-B> <output-name>`

	`image-A`, `image-B` - TIFF image
	`output-name` - without extension

Example:

```
./render.sh image-1.tif image-2.tif image-render
```

The result is a hundred images `image-render-1.jpg`..`image-render-100.jpg`

