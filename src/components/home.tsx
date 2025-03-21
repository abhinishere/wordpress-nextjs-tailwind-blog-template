import Link from "@/components/Link";
import siteMetadata from "@/config/site-metadata";
import { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Categories from "./categories";
import ThumbnailMedia from "./thumbnail-media";

const MAX_DISPLAY = 10;

interface IHome {
  posts: Post[];
}

export default function Home({ posts }: IHome) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && "No posts found."}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, excerpt, categories, featured_media } =
              post;
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-4 xl:grid xl:grid-cols-4 xl:items-start xl:space-y-0 xl:space-x-4">
                    <ThumbnailMedia featuredMediaId={featured_media} />
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
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
                          <dl>
                            <dt className="sr-only">Published on</dt>
                            <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                              <time dateTime={date}>
                                {formatDate(post.date)}
                              </time>
                            </dd>
                          </dl>
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
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  );
}
