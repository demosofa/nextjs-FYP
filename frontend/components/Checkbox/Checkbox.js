import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';

const Kits = createContext();

/**
 * @param {{
 * 	children: React.Children;
 * 	checked: string[];
 * 	setChecked?: (checks: string[]) => unknown;
 * 	type: 'checkbox' | 'radio';
 * 	name: string;
 * 	[key: string]: any;
 * }} param0
 * @returns
 */
export default function Checkbox({
	children,
	checked = [],
	setChecked,
	type = 'checkbox',
	name = '',
	...props
}) {
	const [checks, setChecks] = useState(checked);

	const setCheckedRef = useRef(setChecked);

	useEffect(() => {
		setCheckedRef.current = setChecked;
	}, [setChecked]);

	useEffect(() => {
		setCheckedRef.current?.(checks);
	}, [checks]);

	return (
		<Kits.Provider value={{ checks, setChecks, type, name }}>
			<fieldset className='border-none' {...props}>
				{children}
			</fieldset>
		</Kits.Provider>
	);
}

Checkbox.Item = function Item({
	children,
	value = children,
	defaultChecked = false,
	onChange,
	...props
}) {
	const { checks, setChecks, type, name } = useContext(Kits);
	const handleCheck = useCallback(() => {
		if (type === 'checkbox')
			setChecks((prev) =>
				prev.includes(value)
					? prev.filter((i) => i !== value)
					: [...prev, value]
			);
		else if (type === 'radio') setChecks([value]);
	}, [setChecks, type, value]);

	useEffect(() => {
		if (defaultChecked) handleCheck();
	}, [defaultChecked, handleCheck]);

	return (
		<>
			<input
				{...props}
				type={type}
				name={name}
				value={value}
				onChange={(e) => {
					if (typeof onChange === 'function') onChange(e);
					handleCheck();
				}}
				checked={checks.includes(value)}
			/>
			{children}
		</>
	);
};
