import { createContext, useContext, useRef } from 'react';
import useMedia, { MediaObj } from '@hooks/useMedia';

const Media = createContext<MediaObj>({ device: '', Devices: {} });

export default function MediaContext({ children }) {
	const screens = useRef({
		sm: { max: '767px' },
		// => @media (min-width: 640px and max-width: 767px) { ... }

		md: { min: '768px', max: '1023px' },
		// => @media (min-width: 768px and max-width: 1023px) { ... }

		lg: { min: '1024px', max: '1279px' },
		// => @media (min-width: 1024px and max-width: 1279px) { ... }

		xl: { min: '1280px', max: '1535px' },
		// => @media (min-width: 1280px and max-width: 1535px) { ... }

		'2xl': { min: '1536px' }
	});

	const { device, Devices } = useMedia(screens.current);

	return (
		<Media.Provider value={{ device, Devices }}>{children}</Media.Provider>
	);
}

export function useMediaContext() {
	return useContext(Media);
}
