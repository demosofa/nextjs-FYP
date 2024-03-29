import { useEffect, useRef, useState } from 'react';
import { GrFormClose } from 'react-icons/gr';

import style from './TagsInput.module.css';

/**
 * @param {{
 * 	prevTags: string[];
 * 	setPrevTags: (tags: string[]) => unknown;
 * 	filter: string[];
 * 	className: string;
 * 	[key: string]: any;
 * }} param0
 * @returns
 */
export default function TagsInput({
	prevTags = [],
	setPrevTags,
	filter = [],
	className,
	...props
}) {
	const [text, setText] = useState('');
	const [tags, setTags] = useState(prevTags);
	const [active, setActive] = useState(false);
	const filtered = useRef([...filter]);
	let inputDiv;

	const setPrevTagsRef = useRef(setPrevTags);

	useEffect(() => {
		setPrevTagsRef.current = setPrevTags;
	}, [setPrevTags]);

	useEffect(() => setPrevTagsRef.current(tags), [tags]);

	const handleDelete = (index) => {
		setTags((prev) => prev.filter((tag) => tag !== tags[index]));
	};

	const handleFilter = (value) => {
		filtered.current = filter.filter((data) =>
			data.toUpperCase().includes(value.toUpperCase())
		);
		setText(value);
	};

	const handleInput = (e) => {
		let input = text.trim();
		if (input.length && input.slice(-1) === ',') {
			input = input.replaceAll(',', '');
			if (!tags.includes(input) && input.length) setTags([...tags, input]);
			handleFilter('');
			e.target.focus();
		}
	};

	return (
		<div className={`${style.container} ${className}`}>
			{tags.map((tag, index) => {
				return (
					<div key={index} className={style.tag} {...props}>
						{tag}
						<GrFormClose
							className={style.icon}
							onClick={() => handleDelete(index)}
						/>
					</div>
				);
			})}
			<div className={style.searchbox}>
				<input
					ref={(e) => {
						if (e !== null) inputDiv = e;
					}}
					placeholder='input your tags'
					value={text}
					onChange={(e) => {
						handleFilter(e.target.value);
						setActive(true);
					}}
					onKeyUp={handleInput}
				/>
				{filter.length !== 0 && (
					<button
						onClick={() => {
							handleFilter('');
							setActive((prev) => !prev);
						}}
					></button>
				)}
				{active && (
					<div className={style.dropdown}>
						{filtered.current.map((target, index) => (
							<div
								key={index}
								className={style.target}
								onClick={(e) => {
									handleFilter(e.target.innerText);
									inputDiv.focus();
								}}
							>
								{target}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
