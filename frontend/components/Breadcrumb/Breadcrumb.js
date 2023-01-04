import Link from "next/link";
import { Fragment } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function Breadcrumb({ categories, className, ...props }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <Link className="sm:text-xs" href="/">
        Home
      </Link>
      {categories.map((category) => (
        <Fragment key={category._id}>
          <MdOutlineKeyboardArrowRight />
          <Link
            className="sm:text-xs"
            href={{
              pathname: "/search",
              query: {
                category: category.name,
              },
            }}
          >
            {category.name}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
