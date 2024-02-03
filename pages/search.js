import { Pagination } from '@components';
import { ProductCard } from '@containers';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addNotification } from '@redux/reducer/notificationSlice';

const LocalApi = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps({ query }) {
	if (!query.page) query = { ...query, page: 1 };
	const resProduct = await fetch(
		`${LocalApi}/product/all?` + new URLSearchParams(query)
	);
	const { products, pageCounted } = await resProduct.json();
	return {
		props: {
			query,
			products,
			pageCounted: pageCounted.length ? pageCounted[0]?.count : 0
		}
	};
}

export default function SearchProduct({ query, products, pageCounted }) {
	const [pricing, setPricing] = useState({ from: 1000, to: 1000000 });
	const [rating, setRating] = useState({ from: 0, to: 5 });

	const dispatch = useDispatch();
	const router = useRouter();

	const applyPricing = () => {
		if (
			pricing.from > 0 &&
			pricing.to > 0 &&
			pricing.from % 1000 === 0 &&
			pricing.to % 1000 === 0
		)
			router.push({
				pathname: '/search',
				query: { ...query, pricing: pricing.from + ',' + pricing.to }
			});
		else
			dispatch(
				addNotification({
					message: 'input pricing should be VND currency',
					type: 'error'
				})
			);
	};

	return (
		<>
			<div className='flex gap-3'>
				<Head>
					<title>Search</title>
					<meta name='description' content='Search' />
				</Head>
				<aside className='flex h-full min-h-0 w-52 flex-col gap-5 bg-white px-3 py-2 [&>div]:border-t-2'>
					<div className='flex flex-col items-center gap-3'>
						<label className='text-sm font-medium'>Rating range</label>
						<div className='flex'>
							<input
								className='h-8 w-20 rounded-md border border-gray-400 pl-1 pr-1 text-xs'
								value={rating.from}
								onChange={(e) => {
									if (e.target.value >= 0)
										setRating((prev) => ({ ...prev, from: e.target.value }));
								}}
							/>
							<span className='mx-1 text-gray-500'>-</span>
							<input
								className='h-8 w-20 rounded-md border border-gray-400 pl-1 pr-1 text-xs'
								value={rating.to}
								onChange={(e) => {
									if (e.target.value <= 5)
										setRating((prev) => ({ ...prev, to: e.target.value }));
								}}
							/>
						</div>
						<button
							className='w-full rounded-lg border-2 border-orange-500 py-1 text-orange-500 duration-300 hover:bg-orange-600 hover:text-orange-100'
							onClick={() =>
								router.push({
									pathname: '/search',
									query: { ...query, rating: rating.from + ',' + rating.to }
								})
							}
						>
							Apply
						</button>
					</div>
					<div className='flex flex-col items-center gap-3'>
						<label className='text-sm font-medium'>Price range</label>
						<div className='flex'>
							<input
								className='h-8 w-20 rounded-md border border-gray-400 pl-1 pr-1 text-xs'
								value={pricing.from}
								onChange={(e) => {
									setPricing((prev) => ({ ...prev, from: e.target.value }));
								}}
							/>
							<span className='mx-1 text-gray-500'>-</span>
							<input
								className='h-8 w-20 rounded-md border border-gray-400 pl-1 pr-1 text-xs'
								value={pricing.to}
								onChange={(e) => {
									setPricing((prev) => ({ ...prev, to: e.target.value }));
								}}
							/>
						</div>
						<button
							className='w-full rounded-lg border-2 border-orange-500 py-1 text-orange-500 duration-300 hover:bg-orange-600 hover:text-orange-100'
							onClick={applyPricing}
						>
							Apply
						</button>
					</div>
				</aside>
				<div className='flex flex-4 flex-col gap-6 bg-white py-2 px-3'>
					<div className='flex gap-5'>
						<Link
							href={{
								pathname: '/search',
								query: { ...query, keyword: 'popular' }
							}}
						>
							Popular
						</Link>
						<Link
							href={{
								pathname: '/search',
								query: { ...query, keyword: 'latest' }
							}}
						>
							Latest
						</Link>
					</div>
					<div className='grid grid-cols-fit gap-6 sm:gap-1'>
						{products.map((product) => (
							<ProductCard
								key={product._id}
								href={`/c/${product.productId}?vid=${product._id}`}
								product={product}
							/>
						))}
					</div>
					<Pagination
						totalPageCount={pageCounted}
						currentPage={query.page}
						setCurrentPage={(page) => {
							router.push({ pathname: '/search', query: { ...query, page } });
						}}
					>
						<Pagination.Arrow>
							<Pagination.Number />
						</Pagination.Arrow>
					</Pagination>
				</div>
			</div>
		</>
	);
}
