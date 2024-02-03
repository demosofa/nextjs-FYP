import { useRef, useEffect } from 'react';

import { AnyFunction } from '@shared/types';

export default function useDebounce(
	state: unknown,
	callback: AnyFunction,
	delay = 200
) {
	const callBackRef = useRef(callback);

	useEffect(() => {
		callBackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			callBackRef.current();
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [state, delay]);
}
