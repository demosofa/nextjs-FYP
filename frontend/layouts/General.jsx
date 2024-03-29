import { Animation, Icon } from '@components';
import { SearchDebounce } from '@containers';
import { jwtDecode } from 'jwt-decode';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import {
	AiOutlineHome,
	AiOutlineMenuFold,
	AiOutlineShoppingCart
} from 'react-icons/ai';
import { HiOutlineBell } from 'react-icons/hi2';

import { useMediaContext } from '@contexts/MediaContext';

import { Footer, Navbar, Sidebar } from '.';

const NotifyToast = dynamic(() => import('./NotifyToast/NotifyToast'));

export default function General({ children, arrLink, role }) {
	const { device, Devices } = useMediaContext();
	const [toggle, setToggle] = useState(false);

	return (
		<>
			{[Devices.lg, Devices['2xl']].includes(device) ? (
				<Navbar arrLink={arrLink} />
			) : toggle ? (
				<Animation.Move className='fixed z-20 h-screen gap-5 overflow-y-auto bg-[#f0f2f5] text-[#445261] shadow-md transition-all sm:w-screen md:w-80'>
					<Sidebar className='!relative'>
						<AiOutlineMenuFold
							className='absolute top-0 right-0 cursor-pointer'
							onClick={() => setToggle((prev) => !prev)}
						/>
						<SearchDebounce
							className='ml-0'
							fetchUrl='/api/product/all'
							redirectUrl='/'
						>
							{({ productId, _id, thumbnail, title }) => {
								return (
									<Link href={`/c/${productId}?vid=${_id}`}>
										<span>{title}</span>
										<img src={thumbnail}></img>
									</Link>
								);
							}}
						</SearchDebounce>
						{role && (
							<>
								<Link href='/profile' onClick={() => setToggle(!toggle)}>
									{jwtDecode(localStorage.getItem('accessToken')).username}
								</Link>
								<Sidebar.Item
									href='/notification'
									className='!justify-start'
									onClick={() => setToggle(!toggle)}
								>
									<Icon>
										<HiOutlineBell />
									</Icon>
									<span>Notification</span>
								</Sidebar.Item>
							</>
						)}
						<Sidebar.Item href='/' className='!justify-start'>
							<Icon>
								<AiOutlineHome />
							</Icon>
							<span>Home</span>
						</Sidebar.Item>
						{arrLink?.map(({ title, path, icon }) => (
							<Sidebar.Item
								key={title}
								href={path}
								className='!justify-start'
								onClick={() => setToggle(!toggle)}
							>
								{icon && <Icon>{icon}</Icon>}
								{title}
							</Sidebar.Item>
						))}

						<Sidebar.Item
							href='/c/cart'
							className='!justify-start'
							onClick={() => setToggle(!toggle)}
						>
							<Icon>
								<AiOutlineShoppingCart />
							</Icon>
							My Cart
						</Sidebar.Item>
					</Sidebar>
				</Animation.Move>
			) : (
				<Icon
					style={{ position: 'fixed', top: '10px', left: '10px' }}
					onClick={() => setToggle(!toggle)}
				>
					<AiOutlineMenuFold />
				</Icon>
			)}
			<main className='body'>{children}</main>
			<Footer />
			<NotifyToast />
		</>
	);
}
