import { notFound } from "next/navigation";
import ListLayoutWithTags from "@/components/layouts/list-layout-with-tags/list-layout-with-tags";
import { getAllPosts, getCategories } from "@/lib/queries";

const postPerPage = 15;

export const generateStaticParams = async () => {
  const posts = await getAllPosts(1, postPerPage);
  const paths = Array.from({ length: posts.totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));

  return paths;
};

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const categories = await getCategories();
  const pageNumber = parseInt(params.page as string);
  const posts = await getAllPosts(pageNumber, postPerPage);

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > posts.totalPages || isNaN(pageNumber)) {
    return notFound();
  }

  const pagination = {
    currentPage: pageNumber,
    totalPages: posts.totalPages,
  };

  return (
    <ListLayoutWithTags
      posts={posts.posts}
      pagination={pagination}
      title="All Posts"
      categories={categories}
    />
  );
}
