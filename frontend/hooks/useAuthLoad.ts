import { CreateAxiosDefaults } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { DependencyList, useState } from 'react';

import { expireStorage, retryAxios } from '@utils/index';

import { useAxiosLoad, AxiosLoadCallback } from '.';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function useAuthLoad({
	config,
	cb,
	roles,
	deps = []
}: {
	config?: CreateAxiosDefaults;
	cb?: AxiosLoadCallback;
	roles: string[];
	deps?: DependencyList;
}) {
	const [isLogged, setLogged] = useState(false);
	const [authorized, setAuthorized] = useState(null);
	const [error, setError] = useState();

	const { loading, axiosInstance } = useAxiosLoad({
		config,
		deps,
		callback: async (axiosInstance, setLoading) => {
			let accessToken = expireStorage.getItem('accessToken') as string;
			retryAxios(axiosInstance);

			try {
				const { role, exp } = jwtDecode(accessToken) as {
					role: string;
					exp: number;
				};

				if (Date.now() >= exp * 1000) throw new Error('token was expired');

				if (!role) {
					setLoading(false);
					setLogged(false);
					setAuthorized(null);
					return;
				} else setLogged(true);

				if (!roles.includes(role)) {
					setLoading(false);
					setAuthorized(null);
					return;
				} else setAuthorized(role);
			} catch (error) {
				await axiosInstance
					.post(`${LocalApi}/auth/refreshToken`, null)
					.then((res) => {
						accessToken = res.data;
						expireStorage.setItem('accessToken', accessToken);

						const { role } = jwtDecode(accessToken) as { role: string };
						setAuthorized(role);
					})
					.catch(({ response }) => {
						if (response.status === 401) {
							localStorage.clear();
							window.location = response.data;
						} else setError(response.message);
					});
			}

			if (cb) {
				axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
				await cb(axiosInstance, setLoading);
			}
		}
	});
	return { loading, isLogged, authorized, error, axiosInstance };
}
