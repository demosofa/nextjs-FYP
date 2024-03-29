import { Animation, Icon } from '@components';
import { jwtDecode } from 'jwt-decode';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineArrowRight, AiOutlineHome } from 'react-icons/ai';
import { HiOutlineBell } from 'react-icons/hi2';

import { Sidebar } from '.';

const NotifyToast = dynamic(() => import('./NotifyToast/NotifyToast'));

function Dashboard({ children, arrLink, role }) {
	const [toggle, setToggle] = useState(false);
	return (
		<>
			<Icon
				className={`fixed ${
					toggle ? 'left-20' : 'left-4'
				} !h-[auto] !w-[auto] bg-[#f0f2f5] p-2 sm:visible`}
				onClick={() => setToggle(!toggle)}
			>
				<Animation.Rotate state={toggle} deg={180}>
					<AiOutlineArrowRight />
				</Animation.Rotate>
			</Icon>

			<Sidebar
				className={`group w-[80px] hover:w-80 ${
					toggle ? 'sm:left-0' : 'sm:left-[-10rem]'
				}`}
			>
				{role && (
					<>
						<Link href='/profile' onClick={() => setToggle(!toggle)}>
							{jwtDecode(localStorage.getItem('accessToken')).username}
						</Link>
						<Sidebar.Item
							href='/notification'
							className='w-10 group-hover:w-full group-hover:justify-start'
							onClick={() => setToggle(!toggle)}
						>
							<Icon>
								<HiOutlineBell />
							</Icon>
							<span className='hidden group-hover:inline-block'>
								Notification
							</span>
						</Sidebar.Item>
					</>
				)}
				<Sidebar.Item
					href='/'
					className='w-10 group-hover:w-full group-hover:justify-start'
				>
					<Icon>
						<AiOutlineHome />
					</Icon>
					<span className='hidden group-hover:inline-block'>Home</span>
				</Sidebar.Item>
				{arrLink?.map(({ title, path, icon }) => (
					<Sidebar.Item
						key={title}
						href={path}
						className='w-10 group-hover:w-full group-hover:justify-start'
					>
						{icon && <Icon>{icon}</Icon>}
						<span className='hidden group-hover:inline-block'>{title}</span>
					</Sidebar.Item>
				))}
			</Sidebar>
			<main className='body'>{children}</main>
			<NotifyToast />
		</>
	);
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
