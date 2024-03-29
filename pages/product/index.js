import { Loading, Pagination, SearchInput } from '@components';
import { useAuthLoad } from '@hooks';
import { ProductStatus, Role, currencyFormat } from '@shared';
import { capitalize } from '@utils';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useDispatch } from 'react-redux';

import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ProductCRUD() {
	const [remove, setRemove] = useState(null);
	const [query, setQuery] = useState({
		search: '',
		filter: '',
		sort: 'title',
		page: 1
	});
	const [search, setSearch] = useState(query.search);
	const [products, setProducts] = useState([]);
	const [totalPageCount, setTotalPageCount] = useState(null);
	const router = useRouter();
	const dispatch = useDispatch();

	const memoCallback = useCallback(
		async (axiosInstance) => {
			const res = await axiosInstance({
				url: `${LocalApi}/product`,
				params: query
			});
			setProducts(res.data.products);
			setTotalPageCount(res.data.pageCounted);
			return;
		},
		[query]
	);

	const { loading, isLogged, authorized } = useAuthLoad({
		cb: memoCallback,
		roles: [Role.admin, Role.seller],
		deps: [query]
	});

	const handleStatus = async (e, index) => {
		try {
			await fetcher({
				url: `${LocalApi}/product/${products[index]._id}`,
				method: 'patch',
				data: {
					status: e.target.value
				}
			});
			setProducts((prev) => {
				const clone = JSON.parse(JSON.stringify(prev));
				clone[index].status = e.target.value;
				return clone;
			});
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	useEffect(() => {
		if (!loading && !isLogged && !authorized) router.push('/login');
		else if (!loading && !authorized) router.back();
	}, [loading, isLogged, authorized, router]);

	const isLoadingInitialData = loading || !isLogged || !authorized;

	return (
		<div className='product-crud__container'>
			<Head>
				<title>Manage Product</title>
				<meta name='description' content='Manage Product' />
			</Head>
			{authorized === Role.admin ? (
				<button
					className='create_btn'
					onClick={() => router.push(`product/create`)}
				>
					<BiPlus />
				</button>
			) : null}
			<div className='flex flex-wrap justify-end gap-4'>
				<SearchInput
					className='!ml-0'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClick={() => setQuery((prev) => ({ ...prev, search }))}
				/>
				<select
					defaultValue=''
					onChange={(e) =>
						setQuery((prev) => ({ ...prev, filter: e.target.value }))
					}
				>
					<option value=''>All</option>
					{Object.values(ProductStatus).map((value) => (
						<option key={value} value={value}>
							{capitalize(value)}
						</option>
					))}
				</select>
			</div>
			{isLoadingInitialData ? (
				<Loading.Dots />
			) : (
				<>
					<div className='manage_table'>
						<table>
							<thead>
								<tr>
									<th>No.</th>
									<th>Thumbnail</th>
									<th style={{ width: '20%' }}>Title</th>
									<th>Status</th>
									<th>Info</th>
									<th>TimeStamp</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.length ? (
									products.map((product, index) => {
										return (
											<tr key={product._id}>
												<td>{index + 1}</td>
												<td>
													<Image
														className='rounded-lg'
														alt='product'
														src={product.images[0].url}
														width={100}
														height={90}
													/>
												</td>
												<td className='group'>
													<p className='line-clamp-1 group-hover:line-clamp-none'>
														{product.title}
													</p>
												</td>
												<td>
													<select
														defaultValue={product.status}
														onChange={(e) => handleStatus(e, index)}
													>
														{[
															ProductStatus.active,
															ProductStatus['non-active']
														].map((value) => (
															<option key={value} value={value}>
																{capitalize(value)}
															</option>
														))}
													</select>
												</td>
												<td>
													<dl>
														<dt>Price</dt>
														<dd>
															{product.variations.length > 1
																? `${currencyFormat(
																		Math.min(
																			...product.variations.map(
																				(item) => item.price
																			)
																		)
																	)} - ${currencyFormat(
																		Math.max(
																			...product.variations.map(
																				(item) => item.price
																			)
																		)
																	)}`
																: currencyFormat(product.variations[0].price)}
														</dd>
														<dt>Quantity</dt>
														<dd>
															{product.variations.length > 1
																? `${Math.min(
																		...product.variations.map(
																			(item) => item.quantity
																		)
																	)} - ${Math.max(
																		...product.variations.map(
																			(item) => item.quantity
																		)
																	)}`
																: product.variations[0].quantity}
														</dd>
													</dl>
												</td>
												<td>
													<p>
														Created at:{' '}
														{new Date(product.createdAt).toLocaleString(
															'en-US',
															{
																timeZone: 'Asia/Ho_Chi_Minh'
															}
														)}
													</p>
													<p>
														Updated at:{' '}
														{new Date(product.updatedAt).toLocaleString(
															'en-US',
															{
																timeZone: 'Asia/Ho_Chi_Minh'
															}
														)}
													</p>
												</td>
												<td>
													<div className='flex flex-wrap gap-2'>
														<button
															className='rounded-lg border-2 border-green-700 px-4 py-2 text-green-700 duration-300 hover:bg-green-700 hover:text-green-100'
															onClick={() => router.push(`/c/${product._id}`)}
														>
															Preview
														</button>
														{authorized === Role.admin ? (
															<>
																<button
																	className='rounded-lg border-2 border-blue-500 px-4 py-2 text-blue-500 duration-300 hover:bg-blue-600 hover:text-blue-100'
																	onClick={() =>
																		router.push(`product/update/${product._id}`)
																	}
																>
																	Edit
																</button>
																<button
																	className='rounded-lg border-2 border-red-600 px-4 py-2 text-red-600 duration-300 hover:bg-red-600 hover:text-red-100'
																	onClick={() => setRemove(index)}
																>
																	Remove
																</button>
															</>
														) : null}
													</div>
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan='7'>
											<p className='text-center'>Please add new products</p>
										</td>
									</tr>
								)}
							</tbody>
						</table>
						{remove !== null && (
							<Remove
								index={remove}
								product={products[remove]}
								setProducts={setProducts}
								setRemove={setRemove}
							/>
						)}
					</div>
					{totalPageCount ? (
						<Pagination
							totalPageCount={totalPageCount}
							currentPage={query.page}
							setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
						>
							<Pagination.Arrow>
								<Pagination.Number />
							</Pagination.Arrow>
						</Pagination>
					) : null}
				</>
			)}
		</div>
	);
}

function Remove({ index, product, setProducts, setRemove }) {
	const dispatch = useDispatch();
	const handleRemove = async () => {
		try {
			await fetcher({
				url: `${LocalApi}/product/${product._id}`,
				method: 'delete'
			});
			setProducts((prev) => prev.filter((_, i) => i !== index));
			setRemove(null);
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};
	return (
		<>
			<div className='backdrop' onClick={() => setRemove(null)} />
			<div className='form_center'>
				<label>{`Are you sure to remove ${product.title}?`}</label>
				<div className='flex gap-3'>
					<button
						className='transform rounded border border-blue-600 bg-transparent py-2 px-4 font-semibold text-blue-600 transition duration-200 ease-in hover:-translate-y-1 hover:border-transparent hover:bg-blue-600 hover:text-white active:translate-y-0'
						onClick={handleRemove}
					>
						Yes
					</button>
					<button
						className='transform rounded border border-red-600 bg-transparent py-2 px-4 font-semibold text-red-600 transition duration-200 ease-in hover:-translate-y-1 hover:border-transparent hover:bg-red-600 hover:text-white active:translate-y-0'
						onClick={() => setRemove(null)}
					>
						No
					</button>
				</div>
			</div>
		</>
	);
}
