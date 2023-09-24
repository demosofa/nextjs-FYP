import { Loading, StarRating } from '@components';
import { expireStorage, retryAxios } from '@utils';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

import { addNotification } from '@redux/reducer/notificationSlice';

export default function Rating({ url }) {
	const fetcher = async (config) => {
		const accessToken = expireStorage.getItem('accessToken');
		try {
			if (accessToken) {
				retryAxios(axios);
				const response = await axios({
					...config,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				});
				if (!response.data) throw Error();
				return response.data;
			} else throw Error();
		} catch (error) {
			return { _id: '', rating: 0 };
		}
	};
	const dispatch = useDispatch();
	const { isLoading, data, mutate } = useSWRImmutable({ url }, fetcher);

	const handleRating = async (rating) => {
		mutate(async (data) => {
			try {
				await fetcher({ url, method: 'put', data: { rating } });
				data.rating = rating;
			} catch (error) {
				dispatch(addNotification({ message: error.message, type: 'error' }));
			}
			return data;
		}, false);
	};

	if (isLoading) return <Loading.Text />;
	return (
		<StarRating value={data.rating} handleRating={handleRating} size='2rem' />
	);
}
