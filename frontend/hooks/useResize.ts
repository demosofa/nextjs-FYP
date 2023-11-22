import { useEffect, useRef } from 'react';

export default function useResize(callback: (...arg0: unknown[]) => unknown) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		window.addEventListener('resize', callbackRef.current);

		return () => window.removeEventListener('resize', callbackRef.current);
	}, []);
}
