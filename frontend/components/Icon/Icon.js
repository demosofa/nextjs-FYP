import styles from './Icon.module.css';

export default function Icon({ children, className, ...props }) {
	return (
		<label className={`${styles.icon} ${className}`} {...props}>
			{children}
		</label>
	);
}
