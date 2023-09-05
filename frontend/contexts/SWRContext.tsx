import axios, { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SWRConfig } from 'swr';
import { addNotification } from '@redux/reducer/notificationSlice';
import { expireStorage, retryAxios } from '@utils/index';

export const fetcher = async (config: AxiosRequestConfig) => {
	const accessToken: string = expireStorage.getItem('accessToken');

	const response = await axios({
		...config,
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return response.data;
};

export default function SWRContext({ children }) {
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		const interceptor = retryAxios(axios);

		return () => axios.interceptors.request.eject(interceptor);
	}, []);

	return (
		<SWRConfig
			value={{
				fetcher,
				onError(err, key, config) {
					if (err?.response?.status === 403) router.back();
					else if (err?.response?.status === 401) router.push('/login');
					else
						dispatch(addNotification({ message: err.message, type: 'error' }));
				},
				onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
					if (error.status === 404 || error.status === 500) return;

					if (retryCount >= 3) return;

					setTimeout(() => revalidate({ retryCount }), 5000);
				}
			}}
		>
			{children}
		</SWRConfig>
	);
}
