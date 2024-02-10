import { createContext, useContext, useEffect, useState } from 'react';

const Kits = createContext({ toggle: false });

export default function Dropdown({
	component,
	isShow = false,
	clickable = true,
	hoverable = false,
	children,
	onClick,
	onBlur,
	onMouseEnter,
	onMouseLeave,
	className,
	...props
}) {
	const [toggle, setToggle] = useState(isShow);

	useEffect(() => {
		setToggle(isShow);
	}, [isShow]);

	return (
		<Kits.Provider value={{ toggle }}>
			<div
				className={`relative inline-flex justify-center text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 ${className}`}
				{...props}
				onClick={(e) => {
					if (typeof onClick === 'function') onClick(e);
					if (clickable) setToggle((prev) => !prev);
				}}
				onBlur={(e) => {
					if (typeof onBlur === 'function') onBlur(e);
					setToggle(false);
				}}
				onMouseEnter={(e) => {
					if (typeof onMouseEnter === 'function') onMouseEnter(e);
					if (hoverable && !clickable) setToggle(true);
				}}
				onMouseLeave={(e) => {
					if (typeof onMouseLeave === 'function') onMouseLeave(e);
					if (hoverable) setToggle(false);
				}}
			>
				{component}
				{children}
			</div>
		</Kits.Provider>
	);
}

Dropdown.Content = function DropdownContent({ children, className, ...props }) {
	const { toggle } = useContext(Kits);

	if (!toggle) return null;
	return (
		<div
			className={`absolute top-6 z-10 mt-2 flex flex-col rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none [&>*]:px-4 [&>*]:py-2 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};
