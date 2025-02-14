import { notFound } from "next/navigation";
import ListLayoutWithTags from "@/components/layouts/list-layout-with-tags/list-layout-with-tags";
import {
  getAllPosts,
  getCategories,
  getCategoryDataFromSlug,
} from "@/lib/queries";

const POSTS_PER_PAGE = 15;

export const generateStaticParams = async () => {
  const categories = await getCategories();

  return categories.flatMap((category) => {
    const postCount = category.count;
    const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));

    return Array.from({ length: totalPages }, (_, i) => ({
      category: encodeURI(category.slug),
      page: (i + 1).toString(),
    }));
  });
};

export default async function CategoryPage(props: {
  params: Promise<{ category: string; page: string }>;
}) {
  const params = await props.params;
  const categorySlug = decodeURI(params.category);
  const categoryData = await getCategoryDataFromSlug(categorySlug);
  const categories = await getCategories();

  if (!categoryData) {
    return <p>not found</p>;
  }

  const title = categoryData.name;
  const pageNumber = parseInt(params.page);
  const posts = await getAllPosts(
    pageNumber,
    POSTS_PER_PAGE,
    undefined,
    categoryData.id
  );
  const totalPages = posts.totalPages;

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound();
  }

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  };

  return (
    <ListLayoutWithTags
      posts={posts.posts}
      categories={categories}
      pagination={pagination}
      title={title}
    />
  );
}
