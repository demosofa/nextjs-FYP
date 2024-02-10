import { Badge, Dropdown } from '@components';
import { Notification, RouterAuth, SearchDebounce } from '@containers';
import Link from 'next/link';
import { useMemo } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import styles from './Navbar.module.css';

export default function Navbar({ arrLink }) {
	const [linkNav, linkDrop] = useMemo(() => {
		let linkInNav = arrLink.slice(0, 4);
		let linkInDrop = arrLink.slice(4);
		return [linkInNav, linkInDrop];
	}, [arrLink]);
	const cart = useSelector((state) => state.cart);
	return (
		<nav className={styles.nav}>
			<div className={styles.bar}>
				<Link href='/'>Home</Link>
				<SearchDebounce fetchUrl='/api/product/all' redirectUrl='/'>
					{({ _id, thumbnail, title }) => {
						return (
							<Link href={`/c/${_id}`}>
								<span>{title}</span>
								<img src={thumbnail}></img>
							</Link>
						);
					}}
				</SearchDebounce>
			</div>
			<div className={styles.bar}>
				{linkNav?.map((link, index) =>
					link.title ? (
						<Link className='pl-2 pr-2' key={index} href={link.path}>
							{link.title}
						</Link>
					) : null
				)}
				{linkDrop.length ? (
					<Dropdown component={<button className='text-white'>Other</button>}>
						<Dropdown.Content className='right-0 origin-top-right'>
							{linkDrop?.map(
								(link, index) =>
									link.title && (
										<Link
											className='whitespace-nowrap text-black hover:bg-orange-400 hover:text-white'
											key={index}
											href={link.path}
										>
											{link.title}
										</Link>
									)
							)}
						</Dropdown.Content>
					</Dropdown>
				) : null}
			</div>
			<div className={styles.bar}>
				{typeof window !== 'undefined' &&
					localStorage.getItem('accessToken') && (
						<>
							<Link href='/profile'>My Profile</Link>
							<Dropdown
								component={<FaBell color='white' />}
								hoverable={true}
								clickable={false}
							>
								<Dropdown.Content className='right-0 max-h-[85vh] w-64 overflow-y-auto'>
									<Notification />
								</Dropdown.Content>
							</Dropdown>
						</>
					)}
				<RouterAuth />
				<Link href='/c/cart'>
					<Badge value={cart.products.length}>
						<AiOutlineShoppingCart />
					</Badge>
				</Link>
			</div>
		</nav>
	);
}
