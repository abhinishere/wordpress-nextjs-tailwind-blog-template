import Link from "@/components/Link";
import siteMetadata from "@/config/site-metadata";
import { Category, Post } from "@/lib/types";
import Categories from "../../categories";
import { formatDate } from "@/lib/utils";
import Pagination from "./pagination";
import CategoriesList from "./categories-list";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}
interface ListLayoutProps {
  posts: Post[];
  categories: Category[];
  title: string;
  initialDisplayPosts?: Post[];
  pagination?: PaginationProps;
}

export default function ListLayoutWithTags({
  posts,
  categories,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  //   const tagCounts = tagData as Record<string, number>;
  //   const tagKeys = Object.keys(tagCounts);
  //   const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              <h3 className="text-primary-500 font-bold uppercase">
                All Posts
              </h3>
              <CategoriesList categories={categories} />
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { slug, date, title, excerpt, categories } = post;
                return (
                  <li key={slug} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(post.date)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                              dangerouslySetInnerHTML={{
                                __html: title.rendered,
                              }}
                            ></Link>
                          </h2>
                          <div className="flex flex-wrap">
                            <Categories categoriesIds={categories} />
                          </div>
                        </div>
                        <div
                          className="prose max-w-none text-gray-500 dark:text-gray-400"
                          dangerouslySetInnerHTML={{
                            __html: excerpt.rendered,
                          }}
                        ></div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
