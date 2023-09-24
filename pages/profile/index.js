import { Loading } from '@components';
import { useAuthLoad } from '@hooks';
import { dateFormat, Role } from '@shared';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ProductSlider = dynamic(() =>
	import('@containers/ProductSlider/ProductSlider')
);
const MyOrder = dynamic(() => import('@containers/MyOrder/MyOrder'));

const LocalApi = process.env.NEXT_PUBLIC_API;

function MyProfile() {
	const router = useRouter();
	const [data, setData] = useState();
	const recentlyViewed = useSelector((state) => state.recentlyViewed);
	const { loading, isLogged, authorized, error } = useAuthLoad({
		async cb(axiosInstance) {
			const res = await axiosInstance({
				url: `${LocalApi}/profile`
			});
			setData(res.data);
		},
		roles: [Role.customer, Role.admin, Role.shipper, Role.seller]
	});

	useEffect(() => {
		if (!loading && !isLogged && !authorized) router.push('/login');
		else if ((!loading && !authorized) || (!loading && error)) router.back();
	}, [loading, isLogged, authorized, error, router]);

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
		<div className='flex flex-col gap-10 px-24 sm:p-3 md:px-10'>
			<Head>
				<title>My Profile</title>
				<meta name='description' content='My Profile' />
			</Head>
			<div className='card mx-auto h-full min-h-0 !px-5'>
				<dl className='mb-5'>
					<dt className='font-semibold'>Full Name:</dt>
					<dd>{data.fullname}</dd>

					<dt className='font-semibold'>Date of Birth:</dt>
					<dd>{dateFormat(data.dateOfBirth)}</dd>

					<dt className='font-semibold'>Gender:</dt>
					<dd>{data.gender}</dd>

					<dt className='font-semibold'>Phone Number:</dt>
					<dd>{data.phoneNumber}</dd>

					<dt className='font-semibold'>Email:</dt>
					<dd className='line-clamp-1'>{data.email}</dd>
				</dl>
				<Link
					href='/profile/edit'
					className='cursor-pointer rounded-lg border-0 bg-gradient-to-r from-orange-300 to-red-500 px-3 py-2 text-center font-semibold text-white'
				>
					Edit Profile
				</Link>
			</div>
			<div className='flex flex-col rounded-3xl'>
				<label>Recently Viewed Products</label>
				{recentlyViewed.length ? (
					<div className='relative'>
						<ProductSlider products={recentlyViewed} />
					</div>
				) : (
					<label>You haven&apos; t visited any products</label>
				)}
			</div>
			{authorized === Role.seller ? null : <MyOrder />}
		</div>
	);
}

export default dynamic(() => Promise.resolve(MyProfile), { ssr: false });
