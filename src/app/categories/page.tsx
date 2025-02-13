import Link from "@/components/Link";
import { genPageMetadata } from "@/app/seo";
import { getCategories } from "@/lib/queries";
import Category from "@/components/category";

export const metadata = genPageMetadata({
  title: "Categories",
  description: "Browse by categories or topics.",
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            Categories
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {categories.length === 0 && "No categories found."}
          {categories.map((c) => {
            return (
              <div key={c.id} className="mt-2 mr-5 mb-2">
                <Category name={c.name} slug={c.slug} />
                <Link
                  href={`/category/${c.slug}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={`View posts tagged ${c.name}`}
                >
                  {` (${c.count})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
