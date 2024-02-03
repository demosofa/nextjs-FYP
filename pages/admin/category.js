import { Dropdown, Loading } from '@components';
import { useAuthLoad } from '@hooks';
import { Role } from '@shared';
import { Validator } from '@utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { BiDotsVertical } from 'react-icons/bi';
import { useDispatch } from 'react-redux';

import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

import styles from '../../sass/_crudcategory.module.scss';

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function CrudCategory({ maxTree = 3 }) {
	const [categories, setCategories] = useState([]);

	const lstNames = useMemo(() => {
		if (!categories.length) return [];
		return categories.map((item) => item.name);
	}, [categories]);

	const { loading, isLogged, authorized } = useAuthLoad({
		async cb(axiosInstance) {
			const res = await axiosInstance({ url: `${LocalApi}/category` });
			setCategories(res.data);
		},
		roles: [Role.admin]
	});

	const router = useRouter();
	const dispatch = useDispatch();

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

	const handleAddCategory = async (name) => {
		try {
			new Validator(name).isEmpty().isNotSpecial().throwErrors();

			if (lstNames.indexOf(name) !== -1)
				throw new Error('This name already exists in this directory tree');

			const data = await fetcher({
				url: `${LocalApi}/category`,
				method: 'post',
				data: { name, isFirstLevel: true }
			});

			setCategories((prev) => [data, ...prev]);
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	if (loading) return <Loading.Text />;

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>Manage Category</title>
				<meta name='description' content='Manage Category' />
			</Head>
			<CategoryInput callback={handleAddCategory} />
			<div className='flex flex-col gap-5'>
				{categories.length
					? categories.map((category, index) => (
							<SubCategory
								key={category.updatedAt}
								index={index}
								arrTree={lstNames}
								data={category}
								maxTree={maxTree - 1}
								setDelete={() =>
									setCategories((prev) =>
										prev.filter((item) => item._id !== category._id)
									)
								}
							/>
						))
					: null}
			</div>
		</div>
	);
}

function SubCategory({
	data,
	index,
	arrTree = [],
	maxTree,
	setDelete,
	...props
}) {
	const [toggle, setToggle] = useState({
		edit: false,
		add: false,
		more: false
	});
	const [currentCategory, setCurrentCategory] = useState(data);
	const [categories, setCategories] = useState([]);
	const lstNames = useMemo(() => {
		if (!categories.length) return [];
		return categories.map((item) => item.name);
	}, [categories]);
	const dispatch = useDispatch();
	const { loading } = useAuthLoad({
		async cb(axiosInstance) {
			if (toggle.more) {
				const response = await axiosInstance({
					url: `${LocalApi}/category/${currentCategory._id}`
				});
				setCategories(response.data);
			}
		},
		roles: [Role.admin],
		deps: [toggle.more]
	});

	const handleEditSave = async (name) => {
		try {
			new Validator(name).isEmpty().isNotSpecial().throwErrors();
			if (arrTree.indexOf(name) !== -1)
				throw new Error('This name already exists in this directory tree');
			await fetcher({
				url: `${LocalApi}/category/${currentCategory._id}`,
				method: 'patch',
				data: { name }
			});
			setCurrentCategory((prev) => ({ ...prev, name }));
			setToggle((prev) => ({ ...prev, edit: false }));
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	const handleDelete = async () => {
		try {
			await fetcher({
				url: `${LocalApi}/category/${currentCategory._id}`,
				method: 'delete'
			});
			setDelete();
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	const handleAddSubCategory = async (name) => {
		try {
			new Validator(name).isEmpty().isNotSpecial().throwErrors();
			if (arrTree.indexOf(name) !== -1)
				throw new Error('This name already exists in this directory tree');
			const data = await fetcher({
				method: 'put',
				url: `${LocalApi}/category/${currentCategory._id}`,
				data: { name }
			});
			setCategories((prev) => [...prev, data]);
			setToggle((prev) => ({ ...prev, add: false }));
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};

	return (
		<div {...props} className='mb-4 w-full rounded-lg bg-gray-200 p-2'>
			<div className={styles.container}>
				{(toggle.edit && (
					<CategoryInput
						name={currentCategory.name}
						callback={handleEditSave}
						setToggle={(boolean) =>
							setToggle((prev) => ({ ...prev, edit: boolean }))
						}
					/>
				)) || (
					<div className={styles.tab_container}>
						<label>
							<span>{index + 1}. </span>
							{currentCategory.name}
						</label>
						{!toggle.edit && (
							<Dropdown component={<BiDotsVertical />} hoverable={true}>
								<Dropdown.Content className='right-0'>
									<div
										className='text-black hover:bg-orange-400 hover:text-white'
										onClick={() =>
											setToggle((prev) => ({ ...prev, edit: !prev.edit }))
										}
									>
										Edit
									</div>
									<div
										className='text-black hover:bg-orange-400 hover:text-white'
										onClick={handleDelete}
									>
										Delete
									</div>
								</Dropdown.Content>
							</Dropdown>
						)}
					</div>
				)}
			</div>
			{maxTree > 0 && (
				<div className='flex items-center gap-6 border-t py-2 px-3 sm:gap-2'>
					<button
						className='rounded bg-blue-600 px-4 py-2 text-blue-100 transition duration-300 hover:bg-blue-500'
						onClick={() =>
							setToggle((prev) => ({ ...prev, add: !prev.add, more: true }))
						}
					>
						Add
					</button>

					<button
						className='rounded bg-gray-600 px-4 py-2 text-gray-100 transition duration-300 hover:bg-gray-500'
						onClick={() => setToggle((prev) => ({ ...prev, more: !prev.more }))}
					>
						More
					</button>
				</div>
			)}
			{toggle.add && (
				<CategoryInput
					callback={handleAddSubCategory}
					setToggle={() => setToggle((prev) => ({ ...prev, add: false }))}
				/>
			)}
			{loading && <Loading.Text />}
			{toggle.more && (
				<div className={styles.sub_categories_container}>
					{categories.map((category, idx) => (
						<SubCategory
							key={category.updatedAt}
							index={idx}
							data={category}
							arrTree={[currentCategory.name, ...lstNames]}
							maxTree={maxTree - 1}
							setDelete={() =>
								setCategories((prev) =>
									prev.filter((item) => item._id !== category._id)
								)
							}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function CategoryInput({ name = '', callback, setToggle = undefined }) {
	const [input, setInput] = useState(name);
	return (
		<div className='relative mb-4 inline-flex w-full flex-wrap justify-between rounded-lg border border-gray-500 bg-white'>
			<input
				className='flex-2 rounded-lg border-0 bg-white p-2.5 text-sm text-gray-900 focus:outline-none'
				value={input}
				onChange={(e) => setInput(e.target.value.trim())}
			/>
			<div className='flex items-center gap-3 border-t py-2 px-3 sm:gap-1'>
				<button
					className='rounded-lg border-b-4 border-indigo-700 bg-indigo-600 py-1 px-3 text-indigo-100 transition duration-300 hover:border-indigo-800 hover:bg-indigo-700'
					onClick={() => {
						callback(input);
						setInput('');
					}}
				>
					Save
				</button>
				{setToggle && (
					<button
						className='rounded-lg border-b-4 border-orange-700 bg-orange-600 py-1 px-3 text-orange-100 transition duration-300 hover:border-orange-800 hover:bg-orange-700'
						onClick={() => setToggle(false)}
					>
						Cancel
					</button>
				)}
			</div>
		</div>
	);
}
