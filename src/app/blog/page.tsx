import { genPageMetadata } from "@/app/seo";
import ListLayoutWithTags from "@/components/layouts/list-layout-with-tags/list-layout-with-tags";
import { getAllPosts, getCategories } from "@/lib/queries";

// const POSTS_PER_PAGE = 5;

export const metadata = genPageMetadata({ title: "Blog" });

export default async function BlogPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const currentPage = 1;
  const postPerPage = 15;
  const posts = await getAllPosts(currentPage, postPerPage);
  const categories = await getCategories();
  console.log("posts");
  console.log(posts.totalPages);
  //   const totalPages = Math.ceil(posts.posts.length / postPerPage);
  const initialDisplayPosts = posts.posts.slice(0, postPerPage * currentPage);
  const pagination = {
    currentPage: currentPage,
    totalPages: posts.totalPages,
  };

  return (
    <ListLayoutWithTags
      posts={posts.posts}
      categories={categories}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  );
}
