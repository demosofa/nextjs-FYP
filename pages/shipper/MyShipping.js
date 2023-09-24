import { Loading, Pagination } from '@components';
import { ThSortOrderBy } from '@containers';
import { convertTime, currencyFormat, OrderStatus } from '@shared';
import { capitalize, tailwindStatus } from '@utils';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

const ItemsFromOrder = dynamic(() =>
	import('@containers/ItemsFromOrder/ItemsFromOrder')
);
const LocalApi = process.env.NEXT_PUBLIC_API;

export default function MyShipping() {
	const [viewOrder, setViewOrder] = useState(null);
	const [query, setQuery] = useState({
		page: 1,
		status: '',
		sort: 'status',
		orderby: -1
	});
	const [showQR, setShowQR] = useState(null);
	const dispatch = useDispatch();
	const { data, error } = useSWR(
		{
			url: `${LocalApi}/shipper`,
			params: query
		},
		{
			refreshInterval: convertTime('5s').millisecond,
			dedupingInterval: convertTime('5s').millisecond
		}
	);

	const handleShowQR = async (orderId) => {
		try {
			const linkQR = await fetcher({
				url: `${LocalApi}/order/${orderId}`,
				method: 'put'
			});
			setShowQR(linkQR);
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	const isLoadingInitialData = (!data && !error) || error;

	return (
		<div className='px-24 sm:p-4 md:px-10'>
			<Head>
				<title>My Shipping</title>
				<meta name='description' content='My Shipping' />
			</Head>
			<select
				className='w-32'
				defaultValue=''
				onChange={(e) =>
					setQuery((prev) => ({ ...prev, status: e.target.value }))
				}
			>
				<option value=''>All</option>
				{Object.keys(OrderStatus).map((value) => (
					<option key={value} value={value}>
						{capitalize(value)}
					</option>
				))}
			</select>
			{isLoadingInitialData ? (
				<Loading.Dots />
			) : (
				<>
					<div className='manage_table'>
						<table>
							<thead>
								<tr>
									<th>No.</th>
									<th>Order Id</th>
									<ThSortOrderBy
										query={query}
										setQuery={setQuery}
										target='status'
									>
										Status
									</ThSortOrderBy>
									<th>Customer</th>
									<ThSortOrderBy
										query={query}
										setQuery={setQuery}
										target='address'
									>
										Address
									</ThSortOrderBy>
									<th>Phone Number</th>
									<ThSortOrderBy
										query={query}
										setQuery={setQuery}
										target='total'
									>
										Total Price
									</ThSortOrderBy>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{data?.lstShipping.length ? (
									data?.lstShipping.map((order, index) => (
										<tr key={order._id}>
											<td>{index + 1}</td>
											<td>{order._id}</td>
											<td>
												<span className={tailwindStatus(order.status)}>
													{order.status}
												</span>
											</td>
											<td>{order.customer.username}</td>
											<td>
												<a
													className='font-semibold uppercase text-blue-600 hover:text-blue-400'
													target='_blank'
													rel='noreferrer'
													href={`https://maps.google.com/maps?q=${order.address}`}
												>
													{order.address}
												</a>
											</td>
											<td>
												{(order.status === OrderStatus.progress && (
													<p className='text-[#9F6000]'>
														Only show if this order was validated by seller
													</p>
												)) ||
													(order.status === OrderStatus.paid ? (
														<p className='text-[#9F6000]'>
															This information is now hidden
														</p>
													) : (
														order.customer.user.phoneNumber
													))}
											</td>
											<td>{currencyFormat(order.total)}</td>
											<td>
												<div className='flex flex-col items-center'>
													<button
														className='mr-5 whitespace-nowrap uppercase text-green-600 hover:text-green-900 focus:underline focus:outline-none'
														onClick={() => setViewOrder(order.orderItems)}
													>
														View List item
													</button>
													{order.status === OrderStatus.progress ? (
														<button
															className='mr-5 whitespace-nowrap uppercase text-indigo-600 hover:text-indigo-900 focus:underline focus:outline-none'
															onClick={() => handleShowQR(order._id)}
														>
															Show QR for seller to validate this order
														</button>
													) : null}
													<Link
														className='mr-5 whitespace-nowrap uppercase text-purple-600 hover:text-purple-900 focus:underline focus:outline-none'
														href={`/shipping/${order._id}`}
													>
														Manage Progress
													</Link>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan='8'>
											<p className='text-center'>
												Go to this{' '}
												<Link
													className='uppercase text-gray-400 hover:text-orange-500'
													href='/shipper'
												>
													page
												</Link>{' '}
												and accept orders first
											</p>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<Pagination
						className='mt-8'
						totalPageCount={data.pageCounted}
						currentPage={query.page}
						setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
					>
						<Pagination.Arrow>
							<Pagination.Number />
						</Pagination.Arrow>
					</Pagination>
				</>
			)}
			{viewOrder && (
				<ItemsFromOrder viewOrder={viewOrder} setViewOrder={setViewOrder} />
			)}
			{showQR && (
				<>
					<div className='backdrop' onClick={() => setShowQR(null)} />
					<div className='form_center'>
						<img src={showQR} alt='QR code' />
					</div>
				</>
			)}
		</div>
	);
}
