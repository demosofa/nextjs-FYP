import { useEffect } from 'react';

import { AnyFunction } from '@shared/types';

export default function useDebounce(callback: AnyFunction, delay = 275) {
	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await callback?.();
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [callback, delay]);
}
