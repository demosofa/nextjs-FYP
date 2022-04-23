import { useState, useContext, useEffect, createContext } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { usePagination } from "../../hooks";

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
      <div
        className={`pageContainer`}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          padding: `0px 10px`,
        }}
        {...props}
      >
        {children}
      </div>
    </Kits.Provider>
  );
}

Pagination.Arrow = function ArrowPagination({ children, ...props }) {
  const { currentPage, setCurrentPage, totalPageCount } = useContext(Kits);
  return (
    <div {...props}>
      <FaLessThan
        style={{ width: `20px`, height: `20px`, margin: 0 }}
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        }}
      ></FaLessThan>

      {children}

      <FaGreaterThan
        style={{ width: `20px`, height: `20px`, margin: 0 }}
        onClick={() => {
          if (currentPage < totalPageCount) {
            setCurrentPage((prev) => prev + 1);
          }
        }}
      ></FaGreaterThan>
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
    <div>
      {paginationRange.length &&
        paginationRange.map((page) => {
          if (page === "...") return <span>...</span>;
          return (
            <button
              {...props}
              style={{ backgroundColor: page === currentPage && "green" }}
              onClick={(e) => setCurrentPage(parseInt(e.target.innerText))}
            >
              {page}
            </button>
          );
        })}
    </div>
  );
};
