import {
	Breadcrumb,
	Checkbox,
	ImageMagnifier,
	Increment,
	ReadMoreLess,
	Slider,
	StarRating
} from '@components';
import { PriceInfo } from '@containers';
import { Validator } from '@utils';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useMediaContext } from '@contexts/MediaContext';
import { fetcher } from '@contexts/SWRContext';

import { addCart } from '@redux/reducer/cartSlice';
import { addNotification } from '@redux/reducer/notificationSlice';
import { addViewed } from '@redux/reducer/recentlyViewedSlice';

const Rating = dynamic(() => import('@containers/Rating/Rating'), {
	ssr: false
});
const Comment = dynamic(() => import('@containers/Comment/Comment'), {
	ssr: false
});
const ProductSlider = dynamic(
	() => import('@containers/ProductSlider/ProductSlider'),
	{ ssr: false }
);
const ReceivingAddress = dynamic(
	() => import('@containers/ReceivingAddress/ReceivingAddress'),
	{ ssr: false }
);

const LocalApi = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps({ params, query }) {
	const data = await fetch(`${LocalApi}/product/${params.productId}`);
	const product = await data.json();
	let vid = null;
	if (query.vid) vid = query.vid;
	return {
		props: {
			product,
			vid
		}
	};
}

export default function Overview({ product, vid }) {
	const [targetImage, setTargetImage] = useState(product.images[0].url);
	const [quantity, setQuantity] = useState(1);
	const [display, setDisplay] = useState(false);
	const [loading, setLoading] = useState(false);
	const [similarProducts, setSimilarProducts] = useState([]);
	const [options, setOptions] = useState([]);

	const dispatch = useDispatch();
	const router = useRouter();
	const { device, Devices } = useMediaContext();

	const defaultChecked = useMemo(() => {
		if (vid) {
			const current = product.variations.find((item) => item._id === vid);

			return current.types.reduce((prev, curr) => {
				prev.push(curr.name);
				return prev;
			}, []);
		}

		return [];
	}, [vid, product.variations]);

	const targetVariationIdx = useMemo(() => {
		return product.variations.findIndex((item) =>
			item.types.every((value) =>
				options.some((opt) => opt.split(':')[1]?.trim() === value.name)
			)
		);
	}, [options, product.variations]);

	const targetVariation = product.variations[targetVariationIdx];

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${LocalApi}/product/all`, {
				params: {
					category: product.categories.at(-1).name,
					filter: product.title
				}
			})
			.then((res) => {
				setSimilarProducts(res.data.products);
				setLoading(false);
			});
	}, [product.title, product.categories]);

	const generateCart = () => {
		let { _id, title, images } = product;
		let variationId = targetVariation._id;
		let variationImage = targetVariation.thumbnail?.url;
		let price = targetVariation.price;
		let extraCostPerItem =
			(targetVariation.length *
				targetVariation.width *
				targetVariation.height) /
			6000;

		return {
			productId: _id,
			variationId,
			title,
			image: variationImage || images[0].url,
			options,
			extraCostPerItem: Math.ceil(extraCostPerItem) * 5000,
			quantity,
			price,
			total: quantity * price
		};
	};
	const handleAddToCart = () => {
		dispatch(addCart(generateCart()));
		dispatch(
			addNotification({
				message: `Success add ${product.title} to Cart`,
				type: 'success'
			})
		);
	};

	const handleOrder = async (e, address) => {
		e.preventDefault();
		try {
			new Validator(address).isEmpty().isAddress().throwErrors();
			const products = [generateCart()];

			const shippingFee = products.reduce((prev, curr) => {
				return prev + curr.quantity * curr.extraCostPerItem;
			}, 0);

			await fetcher({
				url: `${LocalApi}/order`,
				method: 'post',
				data: {
					products,
					shippingFee,
					total: products[0].total,
					quantity: products[0].quantity,
					address
				}
			});

			setDisplay(false);
			dispatch(
				addNotification({ message: 'Success order product', type: 'success' })
			);

			router.reload();
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	const routerRef = useRef(router);

	useEffect(() => {
		routerRef.current = router;
	}, [router]);

	useEffect(() => {
		if (targetVariation && targetVariation.thumbnail?.url) {
			routerRef.current.replace(
				routerRef.current.asPath,
				{
					pathname: `/c/${targetVariation.productId}`,
					query: { vid: targetVariation._id }
				},
				{ shallow: true }
			);
			setTargetImage(targetVariation.thumbnail.url);
		}
	}, [targetVariation]);

	useEffect(() => {
		const { title, avgRating, images } = product;
		if (targetVariation) {
			const { _id, productId, thumbnail, price, compare, sold } =
				targetVariation;
			dispatch(
				addViewed({
					_id,
					productId,
					title,
					thumbnail: thumbnail ? thumbnail.url : images[0].url,
					price,
					compare,
					avgRating,
					sold
				})
			);
		}
	}, [product, options, dispatch, targetVariation]);

	return (
		<>
			<Breadcrumb className='pl-4' categories={product.categories} />
			<div className='page-overview'>
				<Head>
					<title>{product.title}</title>
					<meta name='description' content={product.description} />
				</Head>
				<div className='container-info'>
					<div className='preview-product'>
						{device === Devices.sm ? null : (
							<ImageMagnifier src={targetImage} className='product-img' />
						)}
						<Slider
							key={product._id}
							className='slider'
							config={{
								slides: {
									perView: device === Devices.sm ? 1 : 4,
									spacing: 12
								}
							}}
						>
							<Slider.Content className='h-20 sm:h-80'>
								{product.images.map((image, index) => (
									<img
										className='rounded-lg'
										alt='variation'
										key={index}
										src={image.url}
										onMouseEnter={() => setTargetImage(image.url)}
									/>
								))}
							</Slider.Content>
						</Slider>
					</div>

					<div className='product-info'>
						<label className='text-2xl'>{product.title}</label>
						<div className='flex w-full items-center gap-2'>
							<StarRating id='star' value={product.avgRating} />
							<label>{`(${product.rateCount} reviews)`}</label>
						</div>

						<PriceInfo
							discount={targetVariation?.compare}
							price={targetVariation?.price}
						/>

						{product.variants.map((variant, index) => {
							return (
								<Checkbox
									key={variant._id}
									type='radio'
									name={variant.name}
									className='flex h-fit items-center justify-between'
									setChecked={(value) =>
										setOptions((prev) => {
											const clone = prev.concat();
											clone[index] = value.join('');
											return clone;
										})
									}
								>
									<label className='text-lg font-medium capitalize'>
										{variant.name}
									</label>
									{variant.options.map((item, index) => {
										return (
											<div className='mx-2 w-full' key={item._id}>
												<Checkbox.Item
													className='peer hidden'
													id={item.name}
													value={`${variant.name}: ${item.name}`}
													defaultChecked={
														defaultChecked.length
															? defaultChecked.includes(item.name)
															: index === 0
													}
												/>
												<label
													className='inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 bg-white font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:bg-orange-600 peer-checked:text-white'
													htmlFor={item.name}
												>
													{item.name}
												</label>
											</div>
										);
									})}
								</Checkbox>
							);
						})}

						{targetVariation?.quantity > 0 ? (
							<div className='flex items-center justify-center gap-3'>
								<Increment
									value={quantity}
									setValue={setQuantity}
									max={targetVariation.quantity}
									style={{ flex: 1 }}
								/>
								<button
									className='btn-add-to-cart shadow-lg'
									onClick={handleAddToCart}
								>
									Add to Cart
								</button>
								<button
									className='btn-add-to-cart shadow-lg'
									onClick={() => setDisplay(true)}
								>
									Order
								</button>
							</div>
						) : (
							<span className='text-2xl font-medium text-gray-700'>
								Out of Stock right now
							</span>
						)}
					</div>
				</div>

				<dl>
					<dt className='text-lg font-medium'>Description: </dt>
					<dd>
						<ReadMoreLess style={{ height: '150px' }}>
							<p className='text-ellipsis whitespace-pre-wrap leading-[1.7]'>
								{product.description}
							</p>
						</ReadMoreLess>
					</dd>

					<dt className='w-fit text-lg font-medium'>Tags: </dt>
					<dd className='ml-2 mt-1'>
						{product.tags.map((tag) => (
							<Link
								className='ml-2'
								key={tag}
								href={{ pathname: '/', query: { search: tag } }}
							>
								#{tag}
							</Link>
						))}
					</dd>
				</dl>

				<Rating url={`${LocalApi}/rating/${product._id}`} />

				<Comment url={`${LocalApi}/product/${product._id}/comment`} />

				{!loading && similarProducts?.length ? (
					<div className='w-full'>
						<p className='my-5'>Similar product you may want to check</p>
						<ProductSlider products={similarProducts} />
					</div>
				) : null}

				{display && (
					<ReceivingAddress setDisplay={setDisplay} handleOrder={handleOrder} />
				)}
			</div>
		</>
	);
}
