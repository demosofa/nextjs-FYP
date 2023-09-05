import { useEffect, useRef } from 'react';

export default function useInterval(
	callback: (...arg0: any[]) => any,
	delay: number
) {
	const savedCallback = useRef<Function>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) return;

		const id = setInterval(savedCallback.current, delay);

		return () => clearInterval(id);
	}, [delay]);
}
