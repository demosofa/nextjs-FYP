import { Loading, Slider } from '@components';
import { ProductCard } from '@containers';
import { useAxiosLoad } from '@hooks';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from '../sass/Home.module.scss';

const LocalApi = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps({ query }) {
	let products = [];
	let pageCounted = 0;
	let categories = [];
	try {
		const resProducts = await axios.get(`${LocalApi}/product/all`, {
			params: query
		});
		const result = resProducts.data;
		products = result.products;
		pageCounted = result.pageCounted.length ? result.pageCounted[0].count : 0;
		const resCategories = await axios.get(`${LocalApi}/category/all`);
		categories = resCategories.data;
	} catch (error) {
		console.log(error);
	}
	return {
		props: { products, categories, pageCounted, query }
	};
}

export default function Home({ products, categories, pageCounted, query }) {
	const [pageLeft, setPageLeft] = useState(pageCounted);
	const [lstProduct, setLstProduct] = useState(products);
	const [currentPage, setCurrentPage] = useState(1);
	const { loading } = useAxiosLoad({
		async callback(axios) {
			if (currentPage > 1 && pageLeft > 0) {
				const res = await axios({
					url: `${LocalApi}/product/all`,
					params: { ...query, page: currentPage }
				});
				setLstProduct((prev) => [...prev, ...res.data.products]);
				setPageLeft((prev) => prev - 1);
			}
		},
		deps: [currentPage]
	});

	useEffect(() => {
		setLstProduct(products);
		setCurrentPage(1);
		setPageLeft(pageCounted);
	}, [products, pageCounted]);

	return (
		<div className={styles.main}>
			<Head>
				<title>HomePage</title>
				<meta name='description' content='Homepage' />
			</Head>
			{/* <div className="trending"></div> */}
			<div className='px-2'>
				<Slider
					config={{
						slides: {
							perView: 'auto',
							spacing: 8
						}
					}}
				>
					<Slider.Content className='py-4'>
						{categories?.map((category) => (
							<div key={category._id} className='card justify-center'>
								<Link
									className='text-center'
									href={{
										pathname: '/search',
										query: { category: category.name }
									}}
								>
									{category.name}
								</Link>
							</div>
						))}
					</Slider.Content>
				</Slider>
			</div>
			<div className='grid grid-cols-fit gap-6 sm:gap-1'>
				{lstProduct?.map((item) => (
					<ProductCard
						key={item._id}
						href={`/c/${item.productId}?vid=${item._id}`}
						product={item}
					/>
				))}
			</div>
			{loading && <Loading.Text />}
			{pageLeft > 1 && (
				<button
					className='main_btn mx-auto'
					onClick={() => setCurrentPage((prev) => prev + 1)}
				>
					More Products
				</button>
			)}
		</div>
	);
}
