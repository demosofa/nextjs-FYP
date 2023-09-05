import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './withAuth';

export const authApi = createApi({
	baseQuery,
	endpoints: (build) => ({
		login: build.mutation({
			query: (body) => ({
				url: 'auth/login',
				method: 'post',
				body
			})
		}),
		register: build.mutation({
			query: (body) => ({
				url: 'auth/register',
				method: 'post',
				body
			})
		}),
		logout: build.mutation({
			query: () => ({
				url: 'auth/logout',
				method: 'post'
			})
		}),
		forgot: build.mutation({
			query: (body) => ({
				url: 'auth/forgotPwd',
				method: 'post',
				body
			})
		})
	})
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useForgotMutation
} = authApi;
