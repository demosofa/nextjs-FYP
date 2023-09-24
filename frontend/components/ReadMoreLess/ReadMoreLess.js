import { useCallback, useState } from 'react';

import { useResize } from '@hooks/index';

import styles from './_readmoreless.module.scss';

export default function ReadMoreLess({ children, style, ...props }) {
	const [isMore, setIsMore] = useState(true);
	const [display, setDisplay] = useState(true);
	const [resize, setResize] = useState(false);
	const Container = useCallback(
		(node) => {
			if (!node) return;
			const childHeight = node.children[0].offsetHeight;
			if (childHeight > parseInt(style.height.replace('px', ''))) {
				setDisplay(true);
				if (!isMore) node.style.height = childHeight + 50 + 'px';
				else node.style.height = style.height;
			} else {
				node.style.height = childHeight + 'px';
				setDisplay(false);
			}
		},
		[isMore, style.height]
	);

	useResize(() => setResize((prev) => !prev));

	const handleClick = (e) => {
		e.stopPropagation();
		setIsMore((prev) => !prev);
	};
	return (
		<div
			ref={Container}
			className={styles.container_content}
			style={style}
			{...props}
		>
			<div className={styles.hidden_content}>{children}</div>
			{display && (
				<div className={`${styles.read} ${isMore ? styles.more : styles.less}`}>
					<button onClick={handleClick}>{isMore ? 'More' : 'Less'}</button>
				</div>
			)}
		</div>
	);
}
