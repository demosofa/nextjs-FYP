import { Loading, QRreader } from '@components';
import { ProgressBar } from '@containers';
import { convertTime, currencyFormat, OrderStatus, Role } from '@shared';
import { expireStorage } from '@utils';
import decoder from 'jwt-decode';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import { useAblyContext } from '@contexts/AblyContext';
import { fetcher } from '@contexts/SWRContext';

import { addNotification } from '@redux/reducer/notificationSlice';

const Modal = dynamic(() => import('@containers/Modal/Modal'));

const LocalApi = process.env.NEXT_PUBLIC_API;
const LocalUrl = process.env.NEXT_PUBLIC_DOMAIN;

function ShippingProgress() {
	const ably = useAblyContext();
	const [channel, setChannel] = useState();
	const [showQR, setShowQR] = useState(null);
	const [showScanner, setShowScanner] = useState(false);
	const auth = useState(() => {
		const accessToken = expireStorage.getItem('accessToken');
		if (accessToken) {
			const { role, accountId } = decoder(accessToken);
			return { role, accountId };
		}
	})[0];
	const dispatch = useDispatch();
	const router = useRouter();
	const {
		data: order,
		error,
		mutate
	} = useSWR(
		router.isReady
			? {
					url: `${LocalApi}/order/${router.query.id}`
			  }
			: null,
		{
			refreshInterval: convertTime('5s').millisecond,
			dedupingInterval: convertTime('5s').millisecond
		}
	);

	const messageCheckPaid = order
		? `Please check if order ${order._id} has been paid by ${order.customer.username}`
		: '';

	useEffect(() => {
		try {
			if (!channel && order) {
				if ([Role.shipper].includes(auth.role))
					setChannel(ably.channels.get(order.customer._id));
				else if ([Role.customer].includes(auth.role))
					setChannel(ably.channels.get(order.shipper._id));
			}
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	}, [order, auth, ably.channels, channel, dispatch]);

	const handleShowQr = async () => {
		if (showQR !== null) setShowQR(null);
		else {
			try {
				const data = await fetcher({
					url: `${LocalApi}/order/${order._id}`,
					method: 'put'
				});
				setShowQR(data);
			} catch (error) {
				dispatch(addNotification({ message: error.message, type: 'error' }));
			}
		}
	};

	const handleScan = (scanData, _, html5QR) => {
		if (scanData) {
			html5QR.pause();
			mutate(async (data) => {
				try {
					await fetcher({
						url: `${LocalApi}/order/${scanData}`,
						method: 'patch',
						data: { orderId: router.query.id }
					});
					setShowScanner(false);
					let content = `Customer has scanned QR successfully`;
					channel.publish({
						name: 'shipping',
						data: {
							message: content,
							type: 'success'
						}
					});
					data.status = OrderStatus.validated;
				} catch (error) {
					setShowScanner(false);
					dispatch(addNotification({ message: error.message, type: 'error' }));
				}
				return data;
			});
		}
	};

	const arrivedState = () => {
		if (auth.role === Role.customer && auth.accountId === order.customer._id) {
			setShowScanner(true);
		} else if (
			auth.role === Role.shipper &&
			auth.accountId === order.shipper._id
		) {
			if (order.status !== OrderStatus.arrived) {
				const content = `Your order ${
					order._id
				} has moved to ${OrderStatus.arrived.toUpperCase()} state `;
				mutate(async (data) => {
					try {
						await fetcher({
							url: `${LocalApi}/order/${order._id}`,
							method: 'patch',
							data: { status: OrderStatus.arrived }
						});
						await fetcher({
							url: `${LocalApi}/notify`,
							method: 'post',
							data: {
								to: order.customer._id,
								link: window.location.href,
								content
							}
						});
						data.status = OrderStatus.arrived;
					} catch (error) {
						dispatch(
							addNotification({ message: error.message, type: 'error' })
						);
					}
					return data;
				});
				channel.publish({
					name: 'shipping',
					data: {
						message: content,
						type: 'link',
						href: `${LocalUrl}/shipping/${order._id}`
					}
				});
			}
			handleShowQr();
		}
	};

	const validatedState = async () => {
		if (auth.role === Role.customer && auth.accountId === order.customer._id) {
			// setShowVnPay(true);
			if (order.status !== OrderStatus.paid) {
				try {
					await fetcher({
						url: `${LocalApi}/notify`,
						method: 'post',
						data: {
							to: order.shipper._id,
							link: window.location.href,
							content: messageCheckPaid
						}
					});
					channel.publish({
						name: 'checkPaid',
						data: {
							url: `${LocalApi}/order/${order._id}`,
							title: 'Check paid by Shipper',
							content: messageCheckPaid,
							data: { status: OrderStatus.paid }
						}
					});
					dispatch(
						addNotification({
							message: 'Please wait for notification sent by shipper',
							type: 'warning'
						})
					);
				} catch (error) {
					dispatch(addNotification({ message: error.message, type: 'error' }));
				}
			}
		}
	};

	const handleCheckStep = (value) => {
		switch (value) {
			case OrderStatus.arrived:
				return arrivedState();
			case OrderStatus.validated:
				return validatedState();
		}
	};

	const styles = {
		dt: 'mb-1 text-xl font-medium text-gray-900',
		dd: 'mb-3 font-normal text-gray-700'
	};

	const steps =
		!order || error
			? []
			: [
					{ title: OrderStatus.pending, allowed: false },
					{ title: OrderStatus.progress, allowed: false },
					{ title: OrderStatus.shipping, allowed: false },
					{
						title: OrderStatus.arrived,
						allowed:
							order.status === OrderStatus.arrived ||
							(order.status === OrderStatus.shipping &&
								auth.role === Role.shipper)
								? true
								: false
					},
					{
						title: OrderStatus.validated,
						allowed:
							order.status === OrderStatus.validated &&
							auth.role === Role.customer
								? true
								: false
					},
					{ title: OrderStatus.paid, allowed: false }
			  ];

	if (!order || error)
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
		<div className='flex flex-col items-center justify-center'>
			<Head>
				<title>Shipping Progress</title>
				<meta name='description' content='Shipping Progress' />
			</Head>
			<dl className='block max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100'>
				<dt className={styles.dt}>Order Id</dt>
				<dd className={styles.dd}>{order._id}</dd>
				<dt className={styles.dt}>Address</dt>
				<dd className={styles.dd}>
					<a
						className='font-semibold uppercase text-blue-600 hover:text-blue-400'
						target='_blank'
						rel='noreferrer'
						href={`https://maps.google.com/maps?q=${order.address}`}
					>
						{order.address}
					</a>
				</dd>
				<dt className={styles.dt}>Quantity</dt>
				<dd className={styles.dd}>{order.quantity}</dd>
				<dt className={styles.dt}>Shipping Fee</dt>
				<dd className={styles.dd}>{currencyFormat(order.shippingFee)}</dd>
				<dt className={styles.dt}>Total</dt>
				<dd className={styles.dd}>
					{currencyFormat(order.total)}
					<span>(Shipping fee not included)</span>
				</dd>
			</dl>
			<ProgressBar
				key={order._id + order.status}
				steps={steps}
				pass={order.status}
				onResult={handleCheckStep}
			/>
			<Modal channel={channel} url={`${LocalApi}/order/${order._id}`} />
			{showQR !== null && (
				<>
					<div className='backdrop' onClick={() => setShowQR(null)} />
					<div className='form_center'>
						<img src={showQR} alt='QR code' />
					</div>
				</>
			)}
			{showScanner && (
				<>
					<div className='backdrop' onClick={() => setShowScanner(false)} />
					<QRreader
						onScanSuccess={handleScan}
						className='form_center !fixed w-full max-w-lg !p-0 sm:max-w-none'
					/>
				</>
			)}
		</div>
	);
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
