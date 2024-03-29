import { Form } from '@components';
import { NotifyToast } from '@layouts';
import { Validator, expireStorage } from '@utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useLoginMutation } from '@redux/api/authApi';
import { addNotification } from '@redux/reducer/notificationSlice';

export default function Login() {
	const [input, setInput] = useState({
		username: '',
		password: ''
	});
	const [login] = useLoginMutation();
	const dispatch = useDispatch();
	const router = useRouter();
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			Object.entries(input).forEach((entry) => {
				switch (entry[0]) {
					case 'username':
						new Validator(entry[1]).isEmpty().throwErrors();
						break;
					case 'password':
						new Validator(entry[1]).isEmpty().isPassWord().throwErrors();
						break;
				}
			});
			const accessToken = await login(input).unwrap();
			expireStorage.setItem('accessToken', accessToken);
			router.back();
		} catch (error) {
			const message = error.data?.message ?? error.message;
			dispatch(addNotification({ message, type: 'error' }));
		}
	};

	useEffect(() => {
		const isAuth = expireStorage.getItem('accessToken');
		if (isAuth) router.back();
	}, [router]);

	return (
		<>
			<div className='login-page'>
				<Head>
					<title>Login</title>
					<meta name='description' content='Login' />
				</Head>
				<div className='background' />
				<div className='login-container'>
					<Form onSubmit={handleSubmit}>
						<Form.Title style={{ fontSize: 'x-large', fontWeight: '600' }}>
							Login
						</Form.Title>
						<Form.Item>
							<Form.Title>UserName</Form.Title>
							<Form.Input
								value={input.username}
								onChange={(e) =>
									setInput((prev) => ({ ...prev, username: e.target.value }))
								}
							/>
						</Form.Item>
						<Form.Item>
							<Form.Title>Password</Form.Title>
							<Form.Password
								value={input.password}
								onChange={(e) =>
									setInput((prev) => ({ ...prev, password: e.target.value }))
								}
							></Form.Password>
						</Form.Item>
						<Form.Submit>Login</Form.Submit>
					</Form>
					<p>
						Forgot Password?{' '}
						<Link
							className='font-bold hover:text-orange-500'
							href='/forgot_password'
						>
							Reset Password
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
