import { useMemo } from 'react';

export const zoomValue = {
	'2.5m': 21,
	'5m': 20,
	'10m': 19,
	'20m': 18,
	'50m': 17,
	'100m': 16,
	'200m': 15,
	'400m': 14,
	'1km': 13,
	'2km': 12,
	'4km': 11,
	'8km': 10,
	'15km': 9
};

export const viewTypeValue = {
	satellite: 'k',
	terrain: 'p',
	hybrid: 'h',
	roadmap: ''
};

export default function GoogleMap({
	title,
	address,
	coordinates,
	viewType = 'roadmap',
	zoom = '400m',
	width,
	height,
	...props
}) {
	const googleMapUrl = useMemo(() => {
		let googleMapsHostUrl = 'https://maps.google.com/maps';
		let query = '';
		if (address) {
			query = address + '+(' + title + ')';
		} else {
			query = coordinates + '+(' + title + ')';
		}
		let urlParams = {
			width,
			height,
			hl: 'en',
			q: query,
			t: viewTypeValue[viewType],
			z: zoomValue[zoom],
			ie: 'UTF8',
			iwloc: 'B',
			output: 'embed'
		};
		let paramString = '';
		for (let key in urlParams) {
			paramString += key + '=' + urlParams[key] + '&';
		}
		let fullUrl =
			googleMapsHostUrl + '?' + encodeURI(paramString.replace(/.$/, ''));
		return fullUrl;
	}, [title, address, coordinates, viewType, zoom, width, height]);

	return (
		<iframe
			sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox'
			width={width}
			height={height}
			src={googleMapUrl}
			{...props}
		/>
	);
}
