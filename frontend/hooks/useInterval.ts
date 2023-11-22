import { useEffect, useRef } from 'react';

import { AnyFunction } from '@shared/types';

export default function useInterval(callback: AnyFunction, delay: number) {
	const savedCallback = useRef<AnyFunction>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) return;

		const id = setInterval(savedCallback.current, delay);

		return () => clearInterval(id);
	}, [delay]);
}
