import axios, { AxiosInstance, AxiosStatic } from 'axios';
import { expireStorage } from '.';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function retryAxios(
	axiosInstance: AxiosStatic | AxiosInstance,
	maxRetry = 2
): number {
	let counter = 0;
	return axiosInstance.interceptors.response.use(undefined, async (error) => {
		if (
			error.response.status === 401 &&
			error.response.data.message === 'Token is expired' &&
			counter <= maxRetry
		) {
			try {
				const response = await axios.post(`${LocalApi}/auth/refreshToken`);
				const accessToken = response.data;
				expireStorage.setItem('accessToken', accessToken);
				const config = {
					...error.config,
					headers: {
						...error.config.headers,
						Authorization: `Bearer ${accessToken}`
					}
				};
				counter += 1;
				return axiosInstance(config);
			} catch (err) {
				if (err.response.status === 401 && !err.response.data.message) {
					localStorage.clear();
					window.location.href = err.response.data;
				} else return Promise.reject(err);
			}
		} else return Promise.reject(error);
	});
}
