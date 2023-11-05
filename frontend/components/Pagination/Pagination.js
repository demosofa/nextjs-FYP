import { createContext, useContext, useEffect, useState } from 'react';

import { usePagination } from '@hooks/index';

import styles from './Pagination.module.css';

const Kits = createContext();

export default function Pagination({
	totalPageCount,
	currentPage,
	setCurrentPage,
	children,
	className,
	...props
}) {
	return (
		<Kits.Provider
			value={{
				currentPage,
				setCurrentPage,
				totalPageCount
			}}
		>
			<div className={`${styles.container} ${className}`} {...props}>
				{children}
			</div>
		</Kits.Provider>
	);
}

Pagination.Arrow = function ArrowPagination({ children, ...props }) {
	const { currentPage, setCurrentPage, totalPageCount } = useContext(Kits);
	return (
		<div className={styles.arrow_nav} {...props}>
			{currentPage > 1 ? (
				<button
					onClick={() => setCurrentPage(currentPage - 1)}
					className={styles.item}
				>
					{'<'}
				</button>
			) : null}

			{children}

			{currentPage < totalPageCount ? (
				<button
					onClick={() => setCurrentPage(currentPage + 1)}
					className={styles.item}
				>
					{'>'}
				</button>
			) : null}
		</div>
	);
};

Pagination.Input = function InputPagination({ children, ...props }) {
	const { currentPage, setCurrentPage, totalPageCount } = useContext(Kits);
	const [inputPage, setInputPage] = useState('1');

	useEffect(() => {
		setInputPage(`${currentPage}`);
	}, [currentPage]);

	return (
		<input
			placeholder={`page 1 ... page ${totalPageCount}`}
			value={inputPage}
			onChange={(e) => setInputPage(e.target.value)}
			onKeyDown={(e) => {
				if (
					e.key === 'Enter' &&
					parseInt(inputPage) <= totalPageCount &&
					parseInt(inputPage) > 0
				) {
					setCurrentPage(parseInt(inputPage));
				}
			}}
			{...props}
		/>
	);
};

Pagination.Number = function NumberPagination({
	children,
	siblingCount = 2,
	...props
}) {
	const { currentPage, setCurrentPage, totalPageCount } = useContext(Kits);
	const paginationRange = usePagination({
		currentPage,
		totalPageCount,
		siblingCount
	});

	// If there are less than 2 times in pagination range we shall not render the component
	if (currentPage === 0 || paginationRange.length < 1) {
		return null;
	}

	return (
		<div className={styles.pagination}>
			{paginationRange.length &&
				paginationRange.map((page, index) => {
					if (page === '...')
						return (
							<span className={`${styles.item} ${styles.dots}`} key={index}>
								...
							</span>
						);
					return (
						<button
							className={`${styles.item} ${
								page === currentPage ? styles.selected : 'bg-white'
							}`}
							key={index}
							{...props}
							onClick={(e) => setCurrentPage(parseInt(e.target.innerText))}
						>
							{page}
						</button>
					);
				})}
		</div>
	);
};
