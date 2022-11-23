import Link from "next/link";
import { Fragment } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function Breadcrumb({ categories, className, ...props }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <Link href="/">
        <a className="sm:text-xs">Home</a>
      </Link>
      {categories.map((category) => (
        <Fragment key={category._id}>
          <MdOutlineKeyboardArrowRight />
          <Link
            href={{
              pathname: "/search",
              query: {
                category: category.name,
              },
            }}
          >
            <a className="sm:text-xs">{category.name}</a>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
