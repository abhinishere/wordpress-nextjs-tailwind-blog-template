import AuthorLayout from "@/components/layouts/author-layouts/author-layout";
import { getAllAuthorsWithPosts, getAuthorBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";

const POSTS_PER_PAGE = 15;

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

  return (
    <div>
      <AuthorLayout author={author} pagination={pagination} posts={posts} />
    </div>
  );
}
