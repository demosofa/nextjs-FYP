import { Dropdown, SearchInput } from '@components';
import { useDebounce } from '@hooks';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addNotification } from '@redux/reducer/notificationSlice';

export default function SearchDebounce({
	children,
	fetchUrl = '/',
	redirectUrl = '/',
	params = {},
	...props
}) {
	const [search, setSearch] = useState('');
	const [contents, setContents] = useState([]);
	const paramsRef = useRef(params);

	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		paramsRef.current = params;
	}, [params]);

	const fetchSearch = useCallback(async () => {
		if (search) {
			try {
				const result = await axios({
					method: 'get',
					url: fetchUrl,
					params: { ...paramsRef.current, search }
				});
				setContents(result.data.products);
			} catch (error) {
				dispatch(addNotification({ message: error.message, type: 'error' }));
			}
		} else {
			setContents([]);
		}
	}, [search, fetchUrl, dispatch]);

	useDebounce(fetchSearch, search ? 275 : 0);

	return (
		<Dropdown
			clickable={false}
			component={
				<SearchInput
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClick={() =>
						router.push({
							pathname: redirectUrl,
							query: { ...paramsRef.current, search }
						})
					}
				/>
			}
			isShow={search && contents.length > 0}
			{...props}
		>
			<Dropdown.Content className='max-h-64 overflow-auto'>
				{contents.length
					? contents.map((data, index, array) => (
							<Fragment key={index}>
								{index > 0 && <hr />}
								{children?.(data, index, array)}
							</Fragment>
						))
					: null}
			</Dropdown.Content>
		</Dropdown>
	);
}
