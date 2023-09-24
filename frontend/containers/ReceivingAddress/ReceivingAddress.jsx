import { Form, GoogleMap } from '@components';
import { useState } from 'react';

export default function ReceivingAddress({ setDisplay, handleOrder }) {
	const [address, setAddress] = useState('');
	return (
		<>
			<div
				className='backdrop'
				onClick={() => {
					setAddress(''), setDisplay(false);
				}}
			/>
			<Form onSubmit={(e) => handleOrder(e, address)} className='form_center'>
				<Form.Title className='!text-lg'>
					Please set form for your checkout
				</Form.Title>
				<Form.Item>
					<Form.Title>Your Address</Form.Title>
					<Form.Input
						placeholder='Street, Ward, District, City'
						onChange={(e) => setAddress(e.target.value)}
					/>
				</Form.Item>

				<GoogleMap width='100%' height='300px' address={address} />

				<Form.Item>
					<Form.Submit>Submit</Form.Submit>
					<Form.Button
						onClick={() => {
							setAddress(''), setDisplay(false);
						}}
					>
						Cancel
					</Form.Button>
				</Form.Item>
			</Form>
		</>
	);
}
