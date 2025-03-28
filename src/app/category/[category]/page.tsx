import siteMetadata from "@/config/site-metadata";
import { genPageMetadata } from "@/app/seo";
import { Metadata } from "next";
import ListLayoutWithTags from "@/components/layouts/list-layout-with-tags/list-layout-with-tags";
import {
  getAllPosts,
  getCategories,
  getCategoryDataFromSlug,
} from "@/lib/queries";

const POSTS_PER_PAGE = 15;

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const category = decodeURI(params.category);
  return genPageMetadata({
    title: category,
    description: `${siteMetadata.title} ${category} tagged content`,
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/category/${category}/feed.xml`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const categories = await getCategories();

  return categories.map((category) => ({
    category: encodeURI(category.slug),
  }));
};

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
}) {
  const params = await props.params;
  const category = decodeURI(params.category);
  const categoryData = await getCategoryDataFromSlug(category);
  const categories = await getCategories();

  if (!categoryData) {
    return <p>not found</p>;
  }

  const title = categoryData.name;
  const posts = await getAllPosts(
    1,
    POSTS_PER_PAGE,
    undefined,
    categoryData.id
  );
  const totalPages = posts.totalPages;
  //   const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
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
