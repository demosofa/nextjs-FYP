import { useCallback, useMemo } from 'react';

import { AnyFunction } from '@shared/types';

export default function useVariantPermutation(
	arrVariant: unknown[]
): unknown[] {
	const permute = useCallback(
		(arr = [], callback: AnyFunction, prefix = []): unknown => {
			if (!arr.length || !arr[0]?.length) return callback(prefix);

			for (let i = 0; i < arr[0]?.length; i++)
				permute(arr.slice(1), callback, [...prefix, arr[0][i]]);
		},
		[]
	);

	return useMemo(() => {
		const permutations = [];

		if (arrVariant.length > 0)
			permute(arrVariant, (variants: unknown) => {
				permutations.push(variants);
			});

		return permutations;
	}, [arrVariant, permute]);
}
