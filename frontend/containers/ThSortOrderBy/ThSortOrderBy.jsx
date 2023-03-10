export default function ThSortOrderBy({
  children,
  query,
  setQuery,
  target,
  color = "gray",
}) {
  return (
    <th
      onClick={() =>
        setQuery((prev) => ({
          ...prev,
          sort: target,
          orderby: prev.orderby * -1,
        }))
      }
    >
      <div className="flex cursor-pointer items-center gap-2">
        {children}
        <div className="flex flex-col">
          <span
            className={`fa fa-caret-up text-${color}-${
              query.sort === target && query.orderby === -1 ? 700 : 400
            }`}
          />
          <span
            className={`fa fa-caret-down text-${color}-${
              query.sort === target && query.orderby === 1 ? 700 : 400
            }`}
          />
        </div>
      </div>
    </th>
  );
}
