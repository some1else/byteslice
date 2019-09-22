# Byteslice prototype

Code-bendy transitions between recent screens from various insecure IoT cameras.

## Requirements

Docker

## Usage

`./start.sh` or `./resume.sh` will bring up the following Docker containers:

- API Server (Node): Manages the graph and relays scraped data to the Projector
- Projector (React): Walks the graph / slices, and sends MIDI to the audio rig
- Scraper (Puppeteer): Takes a random camera URL from insecam
- Importer (Imagemagick): Trims, resizes and converts the captured image into the MatLab format
- Slicer (Bash): Creates an arbitrary number of slices for a byte-level transition between two images (each slice is created by combining different amounts of bytes from both sources to create a proportional mix) 
- Runner (Bash): Schedules new images to be scraped
- Redis: For communication between the server & the workers

## API

### Slice two images, A 72%, B 28%

Syntax: `./byteslice.sh <image-A> <image-B> <percentage> <image-result>`

	`image-A`, `image-B` - TIFF image
	`percentage` - 1..100
	`image-result` - JPG or PNG image

Example:

```
./byteslice.sh image-a.tif image-b.tif 72 blend-72.jpg
```

### Render a hundred slices

Syntax: `./render.sh <image-A> <image-B> <output-name>`

	`image-A`, `image-B` - TIFF image
	`output-name` - without extension

Example:

```
./render.sh image-1.tif image-2.tif image-render
```
