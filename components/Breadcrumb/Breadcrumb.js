import Link from "next/link";

export default function Breadcrumb({ categories }) {
  return (
    <div>
      {categories.map((category) => (
        <Link
          key={category._id}
          href={{
            pathname: "/",
            query: {
              category: category.name,
            },
          }}
        >
          <a>{category.name}</a>
        </Link>
      ))}
    </div>
  );
}
