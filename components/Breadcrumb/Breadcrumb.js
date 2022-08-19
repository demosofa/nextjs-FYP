import Link from "next/link";
import { Fragment } from "react";
import Icon from "../Icon/Icon";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import styles from "./breadcrumb.module.scss";

export default function Breadcrumb({ categories }) {
  return (
    <div className={styles.container}>
      <Link href="/">
        <a>Home</a>
      </Link>
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
            <a>{category.name}</a>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
