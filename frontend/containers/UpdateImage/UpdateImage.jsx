import { Animation, FileUpload, Icon, Loading } from '@components';
import { useAuthLoad, useUpload } from '@hooks';
import { Role } from '@shared';
import { retryAxios, uploadApi } from '@utils';
import axios from 'axios';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiUpload } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { addNotification } from '@redux/reducer/notificationSlice';

import styles from './updateimage.module.scss';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function UpdateImage({ productId, setToggle }) {
	const [storedImages, setStoredImages] = useState([]);
	const [filterImages, setFilterImages] = useState([]);
	const [newImages, setNewImages] = useState([]);
	const [updateImages, setUpdateImages] = useState([]);
	const dispatch = useDispatch();
	const { loading } = useAuthLoad({
		async cb(axiosInstance) {
			const res = await axiosInstance({
				url: `${LocalApi}/product/${productId}/image`
			});
			setStoredImages(res.data);
		},
		roles: [Role.admin]
	});

	const currentSize = useMemo(() => {
		let currentBytes = storedImages?.reduce(
			(prev, curr) => prev + curr.size,
			0
		);
		return currentBytes / (1024 * 1024);
	}, [storedImages]);

	const handleSaveImage = async (e) => {
		e.stopPropagation();
		let uploaded = [];
		try {
			retryAxios(axios);
			if (newImages.length) {
				uploaded = await Promise.all(
					newImages.map((image) =>
						uploadApi(axios, {
							path: 'store',
							file: image
						})
					)
				);
			}
			await axios.put(`${LocalApi}/product/${productId}/image`, {
				newImages: uploaded,
				filterImages
			});
			if (filterImages.length) {
				const arrPublic_id = filterImages.map((item) => item.public_id);
				await axios.post(`${LocalApi}/destroy`, {
					path: 'store',
					files: arrPublic_id
				});
			}
			if (updateImages.length) {
				await Promise.all(
					updateImages.map((image) =>
						uploadApi(axios, {
							path: 'store',
							public_id: image.public_id,
							file: image.file
						})
					)
				);
			}
			setToggle(null);
		} catch (error) {
			const arrPublic_id = uploaded.map((item) => item.public_id);
			await axios.post(`${LocalApi}/destroy`, {
				path: 'store',
				files: arrPublic_id
			});
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	const handleUpdateImage = (preparedForUpload) => {
		setUpdateImages((prev) => {
			const unique = prev.filter(
				(item) => item.public_id !== preparedForUpload.public_id
			);
			return [...unique, preparedForUpload];
		});
	};
	const handleDeleteImage = (e, index) => {
		e.preventDefault();
		setFilterImages((prev) => [
			...prev,
			...storedImages.filter((_, i) => i === index)
		]);
		setStoredImages((prev) => prev.filter((_, i) => i !== index));
	};
	if (loading) return <Loading.Text />;
	return (
		<div>
			<FileUpload
				className='h-80 !max-w-full'
				setPrevFiles={(images) => setNewImages(images)}
				maxByMB={10 - currentSize}
			>
				<Animation.Zoom className={styles.img_animated}>
					{storedImages.map((image, index) => {
						return (
							<StoredImage
								key={image._id}
								image={image}
								handleUpdateImage={handleUpdateImage}
								handleDeleteImage={(e) => handleDeleteImage(e, index)}
							/>
						);
					})}
				</Animation.Zoom>
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
			<div className='mt-2 flex gap-5'>
				<button className='main_btn' type='button' onClick={handleSaveImage}>
					Save
				</button>
				<button
					className='main_btn'
					type='button'
					onClick={() => setToggle(null)}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}

function StoredImage({
	image,
	handleUpdateImage,
	handleDeleteImage,
	...props
}) {
	const [displayOpts, setDisplayOpts] = useState(false);
	const { previews, getFiles } = useUpload({
		callback(files) {
			handleUpdateImage({ public_id: image.public_id, file: files[0] });
		}
	});
	return (
		<div
			className={styles.stored_img}
			onMouseEnter={() => setDisplayOpts(true)}
			onMouseLeave={() => setDisplayOpts(false)}
			{...props}
		>
			<Image alt='product' src={previews[0] || image.url} fill />
			{displayOpts && (
				<div className={styles.img_option}>
					<input
						id={image._id}
						style={{ display: 'none' }}
						type='file'
						onChange={(e) => getFiles(e.target.files, 0)}
						onClick={(event) => {
							event.target.value = null;
						}}
					/>
					<Icon htmlFor={image._id}>
						<BiUpload />
					</Icon>
					<BsTrash onClick={handleDeleteImage} />
				</div>
			)}
		</div>
	);
}
