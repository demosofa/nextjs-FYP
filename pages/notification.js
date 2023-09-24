import { Notification } from '@containers';
import Head from 'next/head';

export default function notification() {
	return (
		<>
			<Head>
				<title>Notification</title>
				<meta name='description' content='Notification' />
			</Head>
			<Notification className='my-3 mx-auto max-w-3xl px-2' />
		</>
	);
}
