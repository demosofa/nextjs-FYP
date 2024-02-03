import { Form } from '@components';
import { NotifyToast } from '@layouts';
import { Validator } from '@utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useForgotMutation } from '@redux/api/authApi';
import { addNotification } from '@redux/reducer/notificationSlice';

export default function ForgotPassword() {
	const [input, setInput] = useState({ username: '', email: '' });
	const [forgot] = useForgotMutation();
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		if (localStorage.getItem('accessToken')) router.push('/');
	}, [router]);

	const handleSubmitSendEmail = async (e) => {
		e.preventDefault();
		try {
			Object.entries(input).forEach((entry) => {
				switch (entry[0]) {
					case 'username':
						new Validator(entry[1]).isEmpty().throwErrors();
						break;
					case 'email':
						new Validator(entry[1]).isEmpty().isEmail().throwErrors();
						break;
				}
			});

			const data = await forgot(input).unwrap();
			dispatch(addNotification({ message: data, type: 'success' }));
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};
	return (
		<>
			<div className='login-page'>
				<Head>
					<title>Forgot Password</title>
					<meta name='description' content='Forgot Password' />
				</Head>
				<div className='background' />
				<div className='login-container'>
					<Form onSubmit={handleSubmitSendEmail}>
						<Form.Title style={{ fontSize: 'large', fontWeight: '600' }}>
							Don&apos; t Worry! Just provide your email and we can do the rest
						</Form.Title>
						<Form.Item>
							<Form.Title>Username</Form.Title>
							<Form.Input
								value={input.username}
								onChange={(e) =>
									setInput((prev) => ({ ...prev, username: e.target.value }))
								}
							/>
						</Form.Item>
						<Form.Item>
							<Form.Title>Email</Form.Title>
							<Form.Input
								value={input.email}
								onChange={(e) =>
									setInput((prev) => ({ ...prev, email: e.target.value }))
								}
							/>
						</Form.Item>
						<Form.Submit>Submit</Form.Submit>
					</Form>
					<p>
						Did you remember?{' '}
						<Link className='font-bold hover:text-orange-500' href='/login'>
							Login
						</Link>
					</p>
					<p>
						New here?{' '}
						<Link className='font-bold hover:text-orange-500' href='/register'>
							Register
						</Link>
					</p>
				</div>
			</div>
			<NotifyToast />
		</>
	);
}
