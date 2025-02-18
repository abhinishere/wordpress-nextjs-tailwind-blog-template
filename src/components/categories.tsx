import Link from "next/link";
import { getCategoriesById } from "@/lib/queries";

interface ICategories {
  categoriesIds: number[];
}

export default async function Categories({ categoriesIds }: ICategories) {
  const categories = await getCategoriesById(categoriesIds);

  return (
    <div>
      {categories?.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
          dangerouslySetInnerHTML={{
            __html: category.name,
          }}
        ></Link>
      ))}
    </div>
  );
}
