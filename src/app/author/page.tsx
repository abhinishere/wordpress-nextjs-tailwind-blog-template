import Link from "@/components/Link";
import { genPageMetadata } from "@/app/seo";
import { getAllAuthors, getCategories } from "@/lib/queries";
import Category from "@/components/category";

export const metadata = genPageMetadata({
  title: "Authors",
  description: "Browse by author.",
});

export default async function AuthorsPage() {
  const authors = await getAllAuthors();
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            Authors
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {authors.length === 0 && "No authors found."}
          {authors.map((a) => {
            return (
              <Link
                key={a.id}
                href={`/author/${a.slug}`}
                className="mt-2 mr-5 mb-2 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium uppercase"
                dangerouslySetInnerHTML={{ __html: a.name }}
              ></Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
