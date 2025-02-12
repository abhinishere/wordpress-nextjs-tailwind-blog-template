"use client";

import { Category } from "@/lib/types";
import { usePathname } from "next/navigation";
import Link from "@/components/Link";

interface ICategoriesList {
  categories: Category[];
}

function CategoriesList({ categories }: ICategoriesList) {
  const pathname = usePathname();

  return (
    <ul>
      {categories.map((c) => {
        return (
          <li key={c.id} className="my-3">
            {decodeURI(pathname.split("/category/")[1]) === c.slug ? (
              <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                {`${c.name} (${c.count})`}
              </h3>
            ) : (
              <Link
                href={`/category/${c.slug}`}
                className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                aria-label={`View posts tagged ${c.name}`}
              >
                {`${c.name} (${c.count})`}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default CategoriesList;
