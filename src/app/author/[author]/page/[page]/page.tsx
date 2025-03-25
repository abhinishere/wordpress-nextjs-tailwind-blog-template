import { genPageMetadata } from "@/app/seo";
import AuthorLayout from "@/components/layouts/author-layouts/author-layout";
import siteMetadata from "@/config/site-metadata";
import { getAllAuthorsWithPosts, getAuthorBySlug } from "@/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

const POSTS_PER_PAGE = 15;

export async function generateMetadata(props: {
  params: Promise<{ author: string; page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const author = decodeURI(params.author);
  const page = decodeURI(params.page);
  const pageNumber = parseInt(page);

  const resData = await getAuthorBySlug(author);

  const totalPages = resData.totalPages;

  return genPageMetadata({
    title: `${resData.author?.name} | Page ${pageNumber} of ${totalPages}`,
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
  const { authors, totalPagesPerAuthor } = await getAllAuthorsWithPosts();

  return authors
    .filter((author) => totalPagesPerAuthor[author.slug] > 0)
    .flatMap((author) => {
      const totalPages = totalPagesPerAuthor[author.slug] || 1;

      return Array.from({ length: totalPages }, (_, i) => ({
        author: encodeURI(author.slug),
        page: (i + 1).toString(),
      }));
    });
};

export default async function AuthorPage(props: {
  params: Promise<{ author: string; page: string }>;
}) {
  const params = await props.params;
  const authorSlug = decodeURI(params.author);
  const page = decodeURI(params.page);
  const pageNumber = parseInt(page);
  const resData = await getAuthorBySlug(authorSlug, pageNumber);

  if (!resData.author || resData.posts.length < 1) {
    return <p>not found</p>;
  }

  const author = resData.author;
  const posts = resData.posts;
  const totalPages = resData.totalPages;

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound();
  }

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  };

  return <AuthorLayout author={author} pagination={pagination} posts={posts} />;
}
