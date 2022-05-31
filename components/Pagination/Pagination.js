import { useState, useContext, useEffect, createContext } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { Icon } from "../";
import { usePagination } from "../../hooks";
import styles from "./Pagination.module.css";

const Kits = createContext();

export default function Pagination({
  totalPageCount,
  children,
  currentPage,
  setCurrentPage,
  ...props
}) {
  return (
    <Kits.Provider
      value={{
        currentPage,
        setCurrentPage,
        totalPageCount,
      }}
    >
      <div className={styles.pagination__container} {...props}>
        {children}
      </div>
    </Kits.Provider>
  );
}

Pagination.Arrow = function ArrowPagination({ children, ...props }) {
  const { currentPage, setCurrentPage, totalPageCount } = useContext(Kits);
  return (
    <div className={styles.arrow_nav} {...props}>
      <Icon
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        }}
      >
        <FaLessThan />
      </Icon>

      {children}

      <Icon
        onClick={() => {
          if (currentPage < totalPageCount) {
            setCurrentPage((prev) => prev + 1);
          }
        }}
      >
        <FaGreaterThan />
      </Icon>
    </div>
  );
};

Pagination.Input = function InputPagination({ children, ...props }) {
  const { currentPage, setCurrentPage, totalPageCount } = useContext(Kits);
  const [inputPage, setInputPage] = useState("1");

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
          e.key === "Enter" &&
          parseInt(inputPage) <= totalPageCount &&
          parseInt(inputPage) > 0
        ) {
          setCurrentPage(parseInt(inputPage));
        }
      }}
      {...props}
    ></input>
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
    siblingCount,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      {paginationRange.length &&
        paginationRange.map((page, index) => {
          if (page === "...")
            return (
              <span
                className={`${styles.pagination__item} ${styles.dots}`}
                key={index}
              >
                ...
              </span>
            );
          return (
            <button
              className={styles.pagination__item}
              key={index}
              {...props}
              style={{
                backgroundColor: page === currentPage ? "green" : "white",
              }}
              onClick={(e) => setCurrentPage(parseInt(e.target.innerText))}
            >
              {page}
            </button>
          );
        })}
    </div>
  );
};
