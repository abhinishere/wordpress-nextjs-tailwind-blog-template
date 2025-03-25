import { genPageMetadata } from "@/app/seo";
import AuthorLayout from "@/components/layouts/author-layouts/author-layout";
import siteMetadata from "@/config/site-metadata";
import {
  getAllAuthors,
  getAllAuthorsWithPosts,
  getAuthorBySlug,
} from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const POSTS_PER_PAGE = 15;

export async function generateMetadata(props: {
  params: Promise<{ author: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const author = decodeURI(params.author);

  const resData = await getAuthorBySlug(author);

  return genPageMetadata({
    title: resData.author?.name ?? "",
    description: resData.author?.description ?? "",
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/author/${author}/feed.xml`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const authors = await getAllAuthors();

  return authors.map((author) => ({
    author: encodeURI(author.slug),
  }));
};

export default async function AuthorPage(props: {
  params: Promise<{ author: string; page: string }>;
}) {
  const params = await props.params;
  const authorSlug = decodeURI(params.author);
  const pageNumber = 1;

  const { author, posts, totalPages } = await getAuthorBySlug(authorSlug);

  if (!author) {
    return notFound();
  }

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  };

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound();
  }

  console.log(totalPages);

  return <AuthorLayout author={author} pagination={pagination} posts={posts} />;
}
