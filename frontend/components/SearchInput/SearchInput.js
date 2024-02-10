import { BiSearchAlt2 } from 'react-icons/bi';

import styles from './searchinput.module.scss';

export default function SearchInput({ onClick, className, ...props }) {
	return (
		<div className={`${styles.search_wrapper} ${className}`}>
			<input {...props} />
			<BiSearchAlt2 style={{ color: 'orangered' }} onClick={onClick} />
		</div>
	);
}
