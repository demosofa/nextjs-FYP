import { FileUpload, Form, Loading, TagsInput } from '@components';
import { Variant, Variation } from '@containers';
import { useAuthLoad } from '@hooks';
import { ProductStatus, Role, currencyFormat } from '@shared';
import {
	Validate,
	capitalize,
	expireStorage,
	retryAxios,
	uploadApi,
	validateVariations
} from '@utils';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { useMediaContext } from '@contexts/MediaContext';

import { addNotification } from '@redux/reducer/notificationSlice';
import { deleteAllVariant } from '@redux/reducer/variantSlice';
import { editAllVariations } from '@redux/reducer/variationSlice';

const SelectCategory = dynamic(
	() => import('@containers/SelectCategory/SelectCategory')
);

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function CreateForm() {
	const [waitForCreate, setWaitForCreate] = useState(false);
	const variants = useSelector((state) => state.variant);
	const variations = useSelector((state) => state.variation);
	const router = useRouter();
	const dispatch = useDispatch();
	const [input, setInput] = useState({
		title: '',
		description: '',
		categories: [],
		status: 'active',
		tags: [],
		images: [],
		manufacturer: ''
	});

	const [displayApplyAllForm, setDisplayApplyAllForm] = useState(false);
	const [info, setInfo] = useState({
		price: 0,
		cost: 0,
		length: 0,
		width: 0,
		height: 0,
		quantity: 0
	});

	const { device, Devices } = useMediaContext();

	const validateVariant = () => {
		if (variants.length) {
			variants.forEach(({ name, options }) => {
				if (!name) throw new Error('Please add value name for Variant');
				if (!options.length)
					throw new Error('Please add value options for Variant ' + name);
			});
		}
	};

	const validateInput = () => {
		const { title, description, status, manufacturer } = input;
		let validate = { title, description, status, manufacturer };
		Object.entries(validate).forEach((entry) => {
			switch (entry[0]) {
				case 'title':
					new Validate(entry[1]).isEmpty().isEnoughLength({ max: 255 });
					break;
				case 'description':
					new Validate(entry[1]).isEmpty().isEnoughLength({ max: 1000 });
					break;
				case 'status':
				case 'manufacturer':
					new Validate(entry[1]).isEmpty();
					break;
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setWaitForCreate(true);
		let uploaded = [];
		try {
			if (!variants.length) throw new Error('Please add new variant');
			if (!input.categories.length) throw new Error('Please select categories');
			validateVariant();
			validateVariations(variations);
			validateInput();
			const accessToken = expireStorage.getItem('accessToken');
			retryAxios(axios);
			uploaded = await Promise.all(
				input.images.map((image) => {
					return uploadApi(axios, {
						path: 'store',
						file: image
					});
				})
			);
			const newInput = { ...input, variants, variations, images: uploaded };
			await axios.post(`${LocalApi}/product`, newInput, {
				headers: { Authorization: `Bearer ${accessToken}` }
			});
			dispatch(deleteAllVariant());
			router.back();
		} catch (error) {
			if (uploaded.length) {
				const arrPublic_id = uploaded.map((item) => item.public_id);
				await axios.post(`${LocalApi}/destroy`, {
					path: 'store',
					files: arrPublic_id
				});
			}
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
		setWaitForCreate(false);
	};

	const handleSelectedCategories = useCallback((index, categoryId) => {
		setInput((prev) => {
			const { images, ...other } = prev;
			const clone = JSON.parse(JSON.stringify(other));
			if (!categoryId) {
				const updatedCategories = clone.categories.filter((_, i) => i < index);
				clone.categories = updatedCategories;
			} else clone.categories[index] = categoryId;
			return { ...clone, images };
		});
	}, []);

	const { loading, isLogged, authorized, error } = useAuthLoad({
		roles: [Role.admin]
	});
	useEffect(() => {
		if (!loading && !isLogged) router.push('/login');
		else if (!loading && isLogged && !authorized) router.back();
		else if (error) router.push('/register');
	}, [loading, isLogged, authorized, error, router]);

	return (
		<>
			<Head>
				<title>Create Product</title>
				<meta name='description' content='Create Product' />
			</Head>
			{waitForCreate ? (
				<>
					<div className='backdrop' />
					<Loading.Spinner
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: `translate(-50%, -50%)`,
							zIndex: 15
						}}
					/>
				</>
			) : null}
			<Form
				className='create_edit'
				onSubmit={handleSubmit}
				onClick={(e) => e.stopPropagation()}
				style={{
					maxWidth: 'none',
					width: 'auto',
					margin:
						([Devices.xl, Devices.lg, Devices['2xl']].includes(device) &&
							'0 9%') ||
						(device === Devices.md && '0 7%') ||
						'0'
				}}
			>
				<Form.Title style={{ fontSize: '20px' }}>Create Product</Form.Title>
				<div className='flex flex-1.8 flex-col gap-6'>
					<div className='flex flex-wrap justify-between'>
						<Form.Item>
							<Form.Title>Title</Form.Title>
							<Form.Input
								value={input.title}
								onChange={(e) =>
									setInput((prev) => ({ ...prev, title: e.target.value }))
								}
							/>
						</Form.Item>
						<Form.Item>
							<Form.Title>Status</Form.Title>
							<select
								defaultValue=''
								onChange={(e) =>
									setInput((prev) => ({ ...prev, status: e.target.value }))
								}
							>
								<option value=''>None</option>
								{[ProductStatus.active, ProductStatus['non-active']].map(
									(value) => (
										<option key={value} value={value}>
											{capitalize(value)}
										</option>
									)
								)}
							</select>
						</Form.Item>
					</div>

					<div className='flex flex-wrap justify-between'>
						<Form.Item>
							<Form.Title>Category</Form.Title>
							<div className='flex flex-wrap gap-2'>
								<SelectCategory
									setSelectedCategories={handleSelectedCategories}
								/>
							</div>
						</Form.Item>

						<Form.Item style={{ justifyContent: 'flex-start' }}>
							<Form.Title style={{ marginBottom: 0 }}>Tags</Form.Title>
							<TagsInput
								prevTags={input.tags}
								setPrevTags={(tags) =>
									setInput((prev) => ({ ...prev, tags: tags }))
								}
							/>
						</Form.Item>
					</div>

					<Form.Item style={{ flexDirection: 'column' }}>
						<Form.Title>Description</Form.Title>
						<Form.TextArea
							value={input.description}
							onChange={(e) =>
								setInput((prev) => ({ ...prev, description: e.target.value }))
							}
						/>
						<label>{`${input.description.length}/1000`}</label>
					</Form.Item>

					<FileUpload
						prevFiles={input.images}
						setPrevFiles={(images) => setInput((prev) => ({ ...prev, images }))}
						style={{ width: '100%' }}
					>
						<FileUpload.Show />
						<FileUpload.Input
							id='file_input'
							multiple
							style={{
								display: 'none'
							}}
						>
							<label htmlFor='file_input' className='add_file__btn'>
								<AiOutlinePlus style={{ width: '30px', height: '30px' }} />
							</label>
						</FileUpload.Input>
					</FileUpload>
					<Form.Item>
						<Form.Title>Manufacturer</Form.Title>
						<Form.Input
							value={input.manufacturer}
							onChange={(e) =>
								setInput((prev) => ({
									...prev,
									manufacturer: e.target.value
								}))
							}
						/>
					</Form.Item>

					<Variant />

					<Form.Button onClick={() => setDisplayApplyAllForm(true)}>
						Apply all Info to all Variations
					</Form.Button>

					<Variation />
				</div>

				<Form.Item style={{ justifyContent: 'flex-start' }}>
					<Form.Submit>Submit</Form.Submit>
					<Form.Button
						onClick={() => {
							dispatch(deleteAllVariant());
							router.back();
						}}
					>
						Cancel
					</Form.Button>
				</Form.Item>
			</Form>

			{displayApplyAllForm ? (
				<>
					<div
						className='backdrop'
						onClick={() => setDisplayApplyAllForm(false)}
					/>
					<Form
						className='form_center'
						onSubmit={(e) => {
							e.preventDefault();
							dispatch(
								editAllVariations({
									price: info.price,
									cost: info.cost,
									length: info.length,
									width: info.width,
									height: info.height,
									quantity: info.quantity
								})
							);
							setDisplayApplyAllForm(false);
						}}
					>
						<Form.Title className='mx-auto mb-1 text-lg'>
							Information
						</Form.Title>
						<div className='flex max-h-72 flex-col overflow-x-auto'>
							<Form.Item>
								<Form.Title>Quantity</Form.Title>
								<Form.Input
									value={info.quantity}
									onChange={(e) =>
										setInfo((prev) => ({
											...prev,
											quantity: e.target.value
										}))
									}
								/>
							</Form.Item>

							<Form.Item>
								<Form.Title>Length</Form.Title>
								<Form.Input
									value={info.length}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, length: e.target.value }))
									}
								/>
							</Form.Item>

							<Form.Item>
								<Form.Title>Width</Form.Title>
								<Form.Input
									value={info.width}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, width: e.target.value }))
									}
								/>
							</Form.Item>

							<Form.Item>
								<Form.Title>Height</Form.Title>
								<Form.Input
									value={info.height}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, height: e.target.value }))
									}
								/>
							</Form.Item>
						</div>

						<Form.Title className='mx-auto mb-1 text-lg'>Pricing</Form.Title>
						<div className='flex flex-col'>
							<Form.Item>
								<Form.Title>Price</Form.Title>
								<Form.Input
									value={info.price}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, price: e.target.value }))
									}
								/>
							</Form.Item>
							<Form.Item>
								<Form.Title>Cost</Form.Title>
								<Form.Input
									value={info.cost}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, cost: e.target.value }))
									}
								/>
							</Form.Item>
							<dl>
								<dt>Margin</dt>
								<dd>{Math.ceil(100 - (info.cost / info.price) * 100)}%</dd>
								<dt>Profit</dt>
								<dd>{currencyFormat(info.price - info.cost)}</dd>
							</dl>
						</div>
						<Form.Submit>
							Accept applying all Info to all Variations
						</Form.Submit>
						<Form.Button onClick={() => setDisplayApplyAllForm(false)}>
							Cancel
						</Form.Button>
					</Form>
				</>
			) : null}
		</>
	);
}
