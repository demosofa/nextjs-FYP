import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
	retry
} from '@reduxjs/toolkit/query/react';

import { expireStorage } from '@utils/index';

export const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API,
	prepareHeaders: (headers, _api) => {
		const token = expireStorage.getItem('accessToken') as string;

		if (token) {
			headers.set('Authorization', token);
			return headers;
		}
	}
});

const baseQueryReAuth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (
		result.error.status === 401 &&
		(result.error.data as { message: string }).message === 'Token is expired'
	) {
		const token = await baseQuery('/auth/refreshToken', api, extraOptions);

		if (
			token.error.status === 401 &&
			(token.error.data as { message: string }).message === undefined
		) {
			localStorage.clear();
		} else {
			expireStorage.setItem('accessToken', token);
			result = await baseQuery(args, api, extraOptions);
		}
	}

	return result;
};

const baseQueryRetry = retry(baseQueryReAuth, { maxRetries: 3 });

export const withAuth = createApi({
	baseQuery: baseQueryRetry,
	endpoints: () => ({})
});
