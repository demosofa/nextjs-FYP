import { Form, Loading, SearchInput } from '@components';
import { convertTime, currencyFormat, OrderStatus } from '@shared';
import { capitalize, tailwindStatus } from '@utils';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

import { ItemsFromOrder, ThSortOrderBy } from '../';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function MyOrder() {
	const [search, setSearch] = useState('');
	const [params, setParams] = useState({
		status: '',
		search: '',
		sort: 'total',
		orderby: -1
	});
	const [displayCancel, setDisplayCancel] = useState(null);
	const [viewOrder, setViewOrder] = useState(null);
	const dispatch = useDispatch();
	const { isLoading, data, mutate } = useSWR(
		{
			url: `${LocalApi}/profile/order`,
			params
		},
		{
			refreshInterval: convertTime('5s').millisecond,
			dedupingInterval: convertTime('5s').millisecond
		}
	);

	const handleCancelOrder = async (orderId) => {
		mutate(async (data) => {
			try {
				await fetcher({
					method: 'delete',
					url: `${LocalApi}/order/${orderId}`
				});
				setDisplayCancel(null);
				const index = data.findIndex((item) => item._id === orderId);
				data[index].status = 'cancel';
			} catch (error) {
				dispatch(addNotification({ message: error.message, type: 'error' }));
			}
			return data;
		}, false);
	};

	return (
		<div className='w-full'>
			<div className='mb-3 flex justify-between'>
				<SearchInput
					className='!m-0 max-w-fit'
					style={{ width: '100%' }}
					placeholder='search shipper'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClick={() => setParams((prev) => ({ ...prev, search }))}
				/>
				<select
					className='w-32'
					defaultValue=''
					onChange={(e) =>
						setParams((prev) => ({ ...prev, status: e.target.value }))
					}
				>
					<option value=''>All</option>
					{Object.values(OrderStatus).map((value) => (
						<option key={value} value={value}>
							{capitalize(value)}
						</option>
					))}
				</select>
			</div>
			<div className='manage_table min-h-max w-full overflow-x-auto'>
				{isLoading ? (
					<Loading.Spinner className='mx-auto' />
				) : (
					<table>
						<thead>
							<tr>
								<th>No.</th>
								<th>Id</th>
								<ThSortOrderBy
									query={params}
									setQuery={setParams}
									target='status'
								>
									Status
								</ThSortOrderBy>
								<ThSortOrderBy
									query={params}
									setQuery={setParams}
									target='createdAt'
								>
									Order Time
								</ThSortOrderBy>
								<ThSortOrderBy
									query={params}
									setQuery={setParams}
									target='total'
								>
									Total Price
								</ThSortOrderBy>
								<th>Shipper</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{data.length ? (
								data.map((order, index) => (
									<tr key={order._id}>
										<td>{index + 1}</td>
										<td>{order._id}</td>
										<td>
											{order.status === OrderStatus.cancel ? (
												<label className={tailwindStatus(order.status)}>
													{order.status}
												</label>
											) : (
												<Link
													className={tailwindStatus(order.status)}
													href={`/shipping/${order._id}`}
												>
													{order.status}
												</Link>
											)}
										</td>
										<td>
											{new Date(order.createdAt).toLocaleString('en-US', {
												timeZone: 'Asia/Ho_Chi_Minh'
											})}
										</td>
										<td>{currencyFormat(order.total)}</td>
										<td>{order.shipper?.username}</td>
										<td>
											<button
												className='mr-5 whitespace-nowrap uppercase text-indigo-600 hover:text-indigo-900 focus:underline focus:outline-none'
												onClick={() => setViewOrder(order.orderItems)}
											>
												View order items
											</button>
											{order.status === OrderStatus.pending && (
												<button
													className='whitespace-nowrap uppercase text-red-600 hover:text-red-900 focus:underline focus:outline-none'
													onClick={() => setDisplayCancel(order._id)}
												>
													Cancel Order
												</button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan='7'>
										<p className='text-center'>
											Currently there is any orders that meet this filter
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
				{displayCancel && (
					<>
						<div className='backdrop' onClick={() => setDisplayCancel(null)} />
						<Form className='form_center'>
							<Form.Title>Are you sure to cancel {displayCancel}</Form.Title>
							<Form.Item>
								<Form.Button onClick={() => handleCancelOrder(displayCancel)}>
									YES
								</Form.Button>
								<Form.Button onClick={() => setDisplayCancel(null)}>
									NO
								</Form.Button>
							</Form.Item>
						</Form>
					</>
				)}
				{viewOrder && (
					<ItemsFromOrder viewOrder={viewOrder} setViewOrder={setViewOrder} />
				)}
			</div>
		</div>
	);
}
