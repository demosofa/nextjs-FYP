import Link from "next/link";
import { Fragment } from "react";
import Icon from "../Icon/Icon";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import styles from "./breadcrumb.module.scss";

export default function Breadcrumb({ categories, className, ...props }) {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <Link href="/">Home</Link>
      {categories.map((category) => (
        <Fragment key={category._id}>
          <Icon>
            <MdOutlineKeyboardArrowRight />
          </Icon>
          <Link
            href={{
              pathname: "/",
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
