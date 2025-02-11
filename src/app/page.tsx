import Home from "@/components/home";
import { getAllPosts } from "@/lib/queries";

export default async function Page() {
  const currentPage = 1;
  const postPerPage = 15;

  const { posts } = await getAllPosts(currentPage, postPerPage);

  return <Home posts={posts} />;
}
