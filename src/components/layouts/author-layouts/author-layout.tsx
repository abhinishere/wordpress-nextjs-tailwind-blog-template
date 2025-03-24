import Categories from "@/components/categories";
import Image from "@/components/image";
import Link from "@/components/Link";
import { Author, Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Pagination from "../list-layout-with-tags/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

interface Props {
  author: Author;
  pagination?: PaginationProps;
  posts: Post[];
}

export default function AuthorLayout({ author, pagination, posts }: Props) {
  const { name, avatar_urls, description } = author;

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {name}
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar_urls[96] && (
              <Image
                src={avatar_urls[96]}
                alt="avatar"
                width={96}
                height={96}
                className="h-36 w-36 rounded-full"
              />
            )}
            {/* <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">
              {name}
            </h3> */}
            {/* <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div> */}
            <div className="flex space-x-3 pt-6">
              {/* <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} /> */}
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
            {description}
          </div>
        </div>
      </div>
      {posts && (
        <div>
          <ul>
            {posts.map((post) => {
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
      )}
    </>
  );
}
