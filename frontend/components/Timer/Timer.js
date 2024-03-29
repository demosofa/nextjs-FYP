import { useEffect, useRef, useState } from 'react';

import { convertTime } from '@shared/index';

import { useInterval } from '@hooks/index';

import styles from './timer.module.scss';

/**
 * @param {{
 * 	value: string;
 * 	setExpire: () => unknown;
 * 	className: string;
 * 	[key: string]: any;
 * }} param0
 * @returns
 */
export default function Timer({ value, setExpire, className, ...props }) {
	const [counter, setCounter] = useState(() => {
		const time = convertTime(value, true);
		return {
			day: time.day,
			hour: time.hour,
			minute: time.minute,
			second: time.second
		};
	});

	const setExpireRef = useRef(setExpire);

	useEffect(() => {
		setExpireRef.current = setExpire;
	}, [setExpire]);

	useInterval(() => {
		const currentTime = value - Date.now();
		if (currentTime > 0) {
			const time = convertTime(currentTime, true);
			setCounter(() => {
				return {
					day: time.day,
					hour: time.hour,
					minute: time.minute,
					second: time.second
				};
			});
		} else {
			setCounter(() => {
				return {
					day: 0,
					hour: 0,
					minute: 0,
					second: 0
				};
			});
			setExpireRef.current?.();
		}
	}, 1000);
	return (
		<div className={`${styles.wrapper} ${className}`} {...props}>
			<div className={styles.unit + ` day`}>
				{(counter.day < 10 ? '0' : '') + counter.day}
			</div>
			<div className={styles.separate}>:</div>
			<div className={styles.unit + ` hour`}>
				{(counter.hour < 10 ? '0' : '') + counter.hour}
			</div>
			<div className={styles.separate}>:</div>
			<div className={styles.unit + ' minute'}>
				{(counter.minute < 10 ? '0' : '') + counter.minute}
			</div>
			<div className={styles.separate}>:</div>
			<div className={styles.unit + ' second'}>
				{(counter.second < 10 ? '0' : '') + counter.second}
			</div>
		</div>
	);
}
