import { Form } from '@components';
import { Validate } from '@utils';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addNotification } from '@redux/reducer/notificationSlice';

const LocalApi = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps({ params }) {
	try {
		const { id, email } = (
			await axios.get(`${LocalApi}/auth/resetPwd/${params.id}/${params.token}`)
		).data;
		return {
			props: {
				id,
				email,
				token: params.token
			}
		};
	} catch (error) {
		return {
			notFound: true
		};
	}
}

export default function ResetPassword({ id, email, token }) {
	const [input, setInput] = useState({ pwd: '', repeatPwd: '' });
	const dispatch = useDispatch();
	const router = useRouter();
	const handleSubmitChangePwd = async (e) => {
		e.preventDefault();
		try {
			const { pwd, repeatPwd } = input;
			if (pwd !== repeatPwd)
				throw new Error('please input the same password in repeat password');
			Object.entries(input).forEach((entry) => {
				switch (entry[0]) {
					case 'pwd':
					case 'repeatPwd':
						new Validate(entry[1]).isEmpty().isPassWord();
						break;
				}
			});
			await axios.post(`${LocalApi}/auth/resetPwd/${id}/${token}`, { pwd });
			router.replace('/login');
		} catch (error) {
			dispatch(addNotification({ message: error.message, type: 'error' }));
		}
	};
	return (
		<Form onSubmit={handleSubmitChangePwd} className='form_center'>
			<Form.Title>{`Reset Password for ${email}`}</Form.Title>
			<Form.Item>
				<Form.Title>New Password</Form.Title>
				<Form.Password
					value={input.pwd}
					onChange={(e) =>
						setInput((prev) => ({ ...prev, pwd: e.target.value }))
					}
				/>
			</Form.Item>
			<Form.Item>
				<Form.Title>Repeat new Password</Form.Title>
				<Form.Password
					value={input.repeatPwd}
					onChange={(e) =>
						setInput((prev) => ({ ...prev, repeatPwd: e.target.value }))
					}
				/>
			</Form.Item>
			<Form.Submit>Save</Form.Submit>
		</Form>
	);
}
