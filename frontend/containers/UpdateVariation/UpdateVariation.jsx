import { Animation, Checkbox, Loading } from '@components';
import { useAuthLoad } from '@hooks';
import { Role } from '@shared';
import { retryAxios, validateVariations } from '@utils';
import axios from 'axios';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import { addNotification } from '@redux/reducer/notificationSlice';

import styles from './updatevariation.module.scss';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function UpdateVariation({ productId, setToggle }) {
	const [storedVariations, setStoredVariations] = useState([]);
	const [variationImage, setVariationImage] = useState(null);
	const [storedImages, setStoredImages] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const dispatch = useDispatch();

	const { loading } = useAuthLoad({
		async cb(axiosInstance) {
			const res = await axiosInstance({
				url: `${LocalApi}/product/${productId}/variation`
			});
			setStoredVariations(res.data);
		},
		roles: [Role.admin]
	});

	const { loading: loadingImages } = useAuthLoad({
		async cb(axiosInstance) {
			const res = await axiosInstance({
				url: `${LocalApi}/product/${productId}/image`
			});
			setStoredImages(res.data);
		},
		roles: [Role.admin]
	});

	const handleChangeImage = () => {
		setStoredVariations((prev) => {
			const clone = JSON.parse(JSON.stringify(prev));
			clone[variationImage].thumbnail = selectedImage;
			return clone;
		});
		setVariationImage(null);
	};

	const handleEditVariation = (payload, index) => {
		setStoredVariations((prev) => {
			const clone = JSON.parse(JSON.stringify(prev));
			clone[index] = { ...clone[index], ...payload };
			return clone;
		});
	};

	const handleSaveVariation = async () => {
		try {
			validateVariations(storedVariations);
			retryAxios(axios);
			await axios.patch(`${LocalApi}/product/${productId}/variation`, {
				variations: storedVariations
			});
			setToggle(null);
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	if (loading) return <Loading.Text />;
	return (
		<div className='mt-4 flex flex-col gap-6'>
			<div className='overflow-x-auto'>
				<table className='table'>
					<thead>
						<tr>
							<th>No.</th>
							<th>Image</th>
							<th>Type</th>
							<th>Quantity</th>
							<th>Price Info</th>
							<th>Discount</th>
						</tr>
					</thead>
					<tbody>
						{storedVariations?.length ? (
							storedVariations.map((variation, index) => {
								return (
									<tr key={index}>
										<td>
											<label>No.: </label>
											{index + 1}
										</td>
										<td onClick={(e) => setVariationImage(index)}>
											<label>Image: </label>
											{variation.thumbnail && (
												<Image
													alt='product'
													src={variation.thumbnail.url}
													width={160}
													height={140}
												/>
											)}
										</td>
										<td>
											<label>Type: </label>
											{variation.types.map((type) => type.name).join('/')}
										</td>
										<td>
											<label>Quantity: </label>
											<input
												value={variation.quantity}
												onChange={(e) =>
													handleEditVariation(
														{ quantity: e.target.value },
														index
													)
												}
											/>
										</td>
										<td>
											<dl>
												<dt>Price: </dt>
												<dd>
													<input
														value={variation.price}
														onChange={(e) =>
															handleEditVariation(
																{ price: e.target.value },
																index
															)
														}
													/>
												</dd>
												<dt>Cost: </dt>
												<dd>
													<input
														value={variation.cost}
														onChange={(e) =>
															handleEditVariation(
																{ cost: e.target.value },
																index
															)
														}
													/>
												</dd>
											</dl>
										</td>
										<td>
											<input
												value={variation.compare}
												onChange={(e) =>
													handleEditVariation(
														{ compare: e.target.value },
														index
													)
												}
											/>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan='5' className='text-center'>
									There is any variations for this product
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className='flex gap-6'>
				<button
					className='main_btn'
					type='button'
					onClick={handleSaveVariation}
				>
					Save Variation
				</button>
				<button
					className='main_btn'
					type='button'
					onClick={() => setToggle(null)}
				>
					Cancel
				</button>
			</div>

			{variationImage !== null && (
				<>
					<div className='backdrop' onClick={() => setVariationImage(null)} />
					<div className='form_center w-[500px] max-w-full'>
						<Checkbox
							className={styles.radio_img}
							name='image'
							type='radio'
							setChecked={(value) => setSelectedImage(value[0])}
						>
							<Animation.Fade>
								{storedImages?.map((image) => {
									return (
										<Fragment key={image._id}>
											<label
												className={`relative block h-20 w-28 ${
													[image].includes(selectedImage)
														? styles.checked
														: styles.unchecked
												}`}
											>
												<Checkbox.Item
													value={image}
													style={{ display: 'none' }}
												/>
												<Image alt='images' src={image.url} fill />
												{[image].includes(selectedImage) && (
													<div className='absolute top-0 left-0 h-full w-full bg-white/70'>
														<AiOutlineCheck
															width='50%'
															height='50%'
															className={styles.icon}
														/>
													</div>
												)}
											</label>
										</Fragment>
									);
								})}
							</Animation.Fade>
						</Checkbox>
						<button onClick={handleChangeImage}>Save</button>
						<button onClick={() => setVariationImage(null)}>Cancel</button>
					</div>
				</>
			)}
		</div>
	);
}
