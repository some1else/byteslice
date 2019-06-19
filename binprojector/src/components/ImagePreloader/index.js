import React from 'react'

const imgStyle = {
	position: 'absolute',
	opacity: 0,
}

function getImagesFor(imageA, imageB) {
	const desiredImages = []

	for (let i = 1; i <= 100; i++) {
		const image = `/images/${imageA}_${imageB}-${i}.jpg`
		desiredImages.push(image)
	}

	return desiredImages
}

const ImagePreloader = () => {
	let preloadedImages = []

	const	metelkovaNjujork = getImagesFor('metelkova', 'njujork')
	const	njujorkMetelkova = getImagesFor('njujork', 'metelkova')
	const	metelkovaMontenegro = getImagesFor('metelkova', 'montenegro')
	const	montenegroMetelkova = getImagesFor('montenegro', 'metelkova')
	const	montenegroNjujork = getImagesFor('montenegro', 'njujork')
	const	njujorkMontenegro = getImagesFor('njujork', 'montenegro')

	preloadedImages = preloadedImages.concat(
		metelkovaNjujork,
		njujorkMetelkova,
		metelkovaMontenegro,
		montenegroMetelkova,
		montenegroNjujork,
		njujorkMontenegro
	)

	return (
		<div>
			{preloadedImages.map(img => (
				<img key={img} src={img} style={imgStyle} />
			))}
		</div>
	)
}

export default ImagePreloader
