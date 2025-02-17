import { Post, Category, Author, MediaObject } from "@/lib/types";

const baseUrl = process.env.WORDPRESS_URL;

const revalidateTime: number = 3600;

export async function getCategories(): Promise<Category[]> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/categories`;

  const res = await fetch(endpoint);

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();
  return data;
}

export async function getAllPosts(
  pageNumber: number = 1,
  perPage = 10,
  searchTerm: string = "",
  categories: number = 0
): Promise<{
  posts: Post[];
  totalPages: number;
}> {
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: pageNumber.toString(),
    search: searchTerm,
  });

  if (categories !== 0) {
    params.set("categories", categories.toString());
  }

  const endpoint = `${baseUrl}/wp-json/wp/v2/posts?${params.toString()}`;
  console.log(endpoint);

  const res = await fetch(endpoint, {
    next: {
      revalidate: revalidateTime,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch posts");

  const posts = await res.json();

  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");

  return { posts, totalPages };
}

export async function getAllPostsReally(): Promise<{
  allPosts: Post[];
  totalPages: number;
}> {
  let allPosts: Post[] = [];
  let page: number = 1;
  let totalPages = 1;
  let perPage = 100;

  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
  });

  const endpoint = `${baseUrl}/wp-json/wp/v2/posts?${params.toString()}`;

  do {
    const res = await fetch(endpoint, {
      next: {
        revalidate: revalidateTime,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await res.json();

    allPosts = [...allPosts, posts];

    totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");

    page++;
  } while (page <= totalPages);

  return { allPosts, totalPages };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`;

  const res = await fetch(endpoint, {
    next: {
      revalidate: revalidateTime,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch the post");

  const post = await res.json();

  return post[0];
}

export async function getAuthorById(id: number): Promise<Author | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/users/${id}`;

  const res = await fetch(endpoint);

  if (!res.ok) throw new Error("Failed to fetch the author");

  const author = await res.json();

  return author;
}

export async function getCategoriesById(
  ids: number[]
): Promise<Category[] | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/categories?include=${ids.join(
    ","
  )}`;

  const res = await fetch(endpoint);

  if (!res.ok) throw new Error("Failed to fetch categories");

  const categories = await res.json();

  return categories;
}

export async function getCategoryDataFromSlug(
  slug: string
): Promise<Category | null> {
  try {
    const categoryEndpoint = `${baseUrl}/wp-json/wp/v2/categories?slug=${slug}`;
    const categoryRes = await fetch(categoryEndpoint);

    if (!categoryRes.ok) throw new Error("Failed to fetch category");

    const categoryData: Category[] = await categoryRes.json();

    if (categoryData.length === 0) {
      console.error("Category not found");
      return null;
    }

    const category = categoryData[0];

    return category;
  } catch (error) {
    console.error("Error fetching category and posts:", error);
    return null;
  }
}

export async function getFeaturedMediaById(
  id: number
): Promise<MediaObject | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/media/${id}`;

  const res = await fetch(endpoint);

  if (!res.ok) throw new Error("Failed to fetch featured media");

  const featured_media = await res.json();

  return featured_media;
}
