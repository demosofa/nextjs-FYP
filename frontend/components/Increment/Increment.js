import { useEffect, useRef, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import { Icon } from '../';
import styles from './increment.module.scss';

/**
 * @param {{
 * 	value: number;
 * 	setValue: (value: number) => any;
 * 	plus: number;
 * 	minus: number;
 * 	min: number;
 * 	max: number;
 * 	[key: string]: any;
 * }} param0
 * @returns {React.JSX.Element}
 */
export default function Increment({
	value = 1,
	setValue,
	plus = 1,
	minus = 1,
	min = 1,
	max = value + plus,
	...props
}) {
	const [quantity, setQuantity] = useState(value);
	const [input, setInput] = useState(value);

	const setValueRef = useRef(setValue);

	useEffect(() => {
		setValueRef.current = setValue;
	}, [setValue]);

	useEffect(() => {
		if (quantity > max) {
			setQuantity(max);
			setValueRef.current(max);
		} else if (quantity < min) {
			setQuantity(min);
			setValueRef.current(min);
		}
	}, [min, max, quantity]);

	useEffect(() => {
		setInput(quantity);
		setValueRef.current(quantity);
	}, [quantity]);

	return (
		<div className={styles.set_quantity} {...props}>
			<Icon style={{ width: '50px', height: '50px' }}>
				<AiOutlineMinus
					className={`${styles.btn} ${styles.decrease}`}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setQuantity((prev) => {
							if (prev - minus >= min) return prev - minus;
							return prev;
						});
					}}
				/>
			</Icon>

			<input
				className={styles.quantity}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						if (parseInt(input) <= max && parseInt(input) >= min)
							setQuantity(parseInt(input));
						else setInput(quantity);
					}
				}}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			/>

			<Icon style={{ width: '50px', height: '50px' }}>
				<AiOutlinePlus
					className={`${styles.btn} ${styles.increase}`}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setQuantity((prev) => {
							if (prev + plus <= max) return prev + plus;
							return prev;
						});
					}}
				/>
			</Icon>
		</div>
	);
}
