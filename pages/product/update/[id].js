import { Form, Loading, TagsInput } from '@components';
import { useAuthLoad } from '@hooks';
import { Role } from '@shared';
import { Validate } from '@utils';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

const UpdateImage = dynamic(() =>
	import('@containers/UpdateImage/UpdateImage')
);
const UpdateVariation = dynamic(() =>
	import('@containers/UpdateVariation/UpdateVariation')
);

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function UpdateProduct() {
	const [product, setProduct] = useState();
	const [toggle, setToggle] = useState(null);
	const router = useRouter();
	const { loading, isLogged, authorized } = useAuthLoad({
		async cb(axiosInstance) {
			const res = await axiosInstance({
				url: `${LocalApi}/product/${router.query?.id}`
			});
			setProduct(res.data);
		},
		roles: [Role.admin],
		deps: [router.isReady]
	});

	const dispatch = useDispatch();
	const validateInput = () => {
		const { description, manufacturer } = product;
		Object.entries({ description, manufacturer }).forEach((entry) => {
			switch (entry[0]) {
				case 'description':
					new Validate(entry[1]).isEmpty().isEnoughLength({ max: 1000 });
					break;
				case 'manufacturer':
					new Validate(entry[1]).isEmpty().isNotSpecial();
					break;
			}
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const { _id, description, tags } = product;
		try {
			validateInput();
			await fetcher({
				url: `${LocalApi}/product`,
				method: 'put',
				data: { _id, description, tags }
			});
			router.back();
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	useEffect(() => {
		if (!loading && !isLogged && !authorized) router.push('/login');
		else if (!loading && !authorized) router.back();
	}, [loading, isLogged, authorized, router]);

	if (loading || !isLogged || !authorized)
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

	return (
		<Form
			style={{ maxWidth: '800px', margin: '20px auto' }}
			onSubmit={handleSubmit}
		>
			<Head>
				<title>Update Product</title>
				<meta name='description' content='Update Product' />
			</Head>
			<Form.Title style={{ fontSize: '20px' }}>Update Product</Form.Title>
			<Form.Item style={{ flexDirection: 'column' }}>
				<Form.Title>Description</Form.Title>
				<Form.TextArea
					value={product.description}
					onChange={(e) =>
						setProduct((prev) => ({ ...prev, description: e.target.value }))
					}
				/>
				<label>{`${product.description.length}/1000`}</label>
			</Form.Item>
			<Form.Item>
				<Form.Title>Tags</Form.Title>
				<TagsInput
					prevTags={product.tags}
					setPrevTags={(tags) =>
						setProduct((prev) => ({ ...prev, tags: tags }))
					}
				/>
			</Form.Item>
			<Form.Item>
				<Form.Title>Manufacturer</Form.Title>
				<Form.Input
					value={product.manufacturer}
					onChange={(e) =>
						setProduct((prev) => ({ ...prev, manufacturer: e.target.value }))
					}
				/>
			</Form.Item>
			<div className='flex w-full gap-4 sm:gap-0'>
				<div
					className='card flex-1 cursor-pointer items-center'
					onClick={() => setToggle('image')}
				>
					Update Product Image
				</div>
				<div
					className='card flex-1 cursor-pointer items-center'
					onClick={() => setToggle('variation')}
				>
					Update Product Variation
				</div>
			</div>
			{(toggle !== null && toggle === 'image' && (
				<UpdateImage productId={router.query?.id} setToggle={setToggle} />
			)) ||
				(toggle === 'variation' && (
					<UpdateVariation productId={router.query?.id} setToggle={setToggle} />
				))}
			<Form.Item>
				<Form.Submit>Submit</Form.Submit>
				<Form.Button onClick={() => router.back()}>Cancel</Form.Button>
			</Form.Item>
		</Form>
	);
}
