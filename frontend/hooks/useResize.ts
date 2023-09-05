import { DependencyList, useEffect } from 'react';

export default function useResize(
	callback: (...arg0: any[]) => any,
	deps: DependencyList = []
) {
	useEffect(() => {
		const resize = callback;
		window.addEventListener('resize', resize);

		return () => window.removeEventListener('resize', resize);
	}, [callback, deps]);
}
