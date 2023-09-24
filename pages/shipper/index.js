import { Checkbox, Loading, Pagination } from '@components';
import { ThSortOrderBy } from '@containers';
import { convertTime, currencyFormat } from '@shared';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Shipper() {
	const [checkOrder, setCheckOrder] = useState([]);
	const [query, setQuery] = useState({ page: 1, sort: 'status', orderby: -1 });
	const dispatch = useDispatch();
	const router = useRouter();
	const { isLoading, data } = useSWR(
		{
			url: `${LocalApi}/order`,
			params: query
		},
		{
			refreshInterval: convertTime('5s').millisecond,
			dedupingInterval: convertTime('5s').millisecond
		}
	);

	const { mutate } = useSWRImmutable({ url: `${LocalApi}/shipper` });

	if (isLoading)
		return (
			<Loading
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: `translate(-50%, -50%)`
				}}
			/>
		);

	const handleSubmit = async () => {
		mutate(async (data) => {
			try {
				if (data && checkOrder.length) {
					await fetcher({
						url: `${LocalApi}/shipper`,
						method: 'put',
						data: { acceptedOrders: checkOrder }
					});
					dispatch(addNotification({ message: 'Success receive orders' }));
					router.push('/');
				} else throw new Error('Please select orders');
			} catch (error) {
				dispatch(addNotification({ message: error.message, type: 'error' }));
			}
			return data;
		}, false);
	};

	return (
		<div className='px-24 sm:p-4 md:px-10'>
			<Head>
				<title>List pending order</title>
				<meta name='description' content='List pending order' />
			</Head>
			<Checkbox setChecked={(value) => setCheckOrder(value)}>
				<table className='table'>
					<thead>
						<tr>
							<th>Check</th>
							<th>Order Id</th>
							<ThSortOrderBy query={query} setQuery={setQuery} target='total'>
								Price
							</ThSortOrderBy>
							<ThSortOrderBy query={query} setQuery={setQuery} target='address'>
								Address
							</ThSortOrderBy>
						</tr>
					</thead>
					<tbody>
						{data.lstOrder.length ? (
							data.lstOrder.map((order) => (
								<tr key={order._id}>
									<td>
										<Checkbox.Item value={order._id} />
									</td>
									<td>
										<label>Id</label>
										{order._id}
									</td>
									<td>
										<label>Total</label>
										{currencyFormat(order.total)}
									</td>
									<td>
										<label>Address</label>
										<a
											className='font-semibold uppercase text-blue-600 hover:text-blue-400'
											target='_blank'
											rel='noreferrer'
											href={`https://maps.google.com/maps?q=${order.address}`}
										>
											{order.address}
										</a>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan='4'>
									<p className='text-center'>
										Currently, there is any customer ordering
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</Checkbox>
			{data.lstOrder.length ? (
				<div className='mt-8'>
					<Pagination
						totalPageCount={data.pageCounted}
						currentPage={query.page}
						setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
					>
						<Pagination.Arrow>
							<Pagination.Number />
						</Pagination.Arrow>
					</Pagination>
					<button className='main_btn' onClick={handleSubmit}>
						Submit
					</button>
				</div>
			) : null}
		</div>
	);
}
