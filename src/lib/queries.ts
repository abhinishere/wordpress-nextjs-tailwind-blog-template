import { Post, Category, Author, MediaObject, Page } from "@/lib/types";

const baseUrl = process.env.WORDPRESS_URL;

// const revalidateTime: number = 3600;

const revalidateTime: number = 0;

export async function getCategories(): Promise<Category[]> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/categories`;

  const res = await fetch(endpoint);

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();
  return data;
}

export async function getAllPosts(
  pageNumber: number = 1,
  perPage = 15,
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
  const perPage = 100;

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

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/pages?slug=${slug}`;

  const res = await fetch(endpoint, {
    next: {
      revalidate: revalidateTime,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch the page");

  const page = await res.json();

  return page[0] || null;
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
      return null;
    }

    const category = categoryData[0];

    return category;
  } catch (error) {
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

export async function getAllAuthors(): Promise<Author[]> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/users?per_page=100`;

  const res = await fetch(endpoint, {
    next: {
      revalidate: revalidateTime,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch authors");

  const users = await res.json();

  const authors = users.filter(
    (user: Author) => user?.description || user?.link
  );

  return authors;
}

export async function getAllAuthorsWithPosts(
  page: number = 1,
  perPage: number = 15
): Promise<{
  authors: Author[];
  authorsPosts: Record<string, Post[]>;
  totalPagesPerAuthor: Record<string, number>;
}> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/users?per_page=100`;

  const res = await fetch(endpoint, { next: { revalidate: revalidateTime } });
  if (!res.ok) throw new Error("Failed to fetch authors");

  const users: Author[] = await res.json();

  const authorsPosts: Record<string, Post[]> = {};
  const totalPagesPerAuthor: Record<string, number> = {};

  await Promise.all(
    users.map(async (user) => {
      const params = new URLSearchParams({
        author: user.id.toString(),
        per_page: perPage.toString(),
        page: page.toString(),
        _embed: "true",
      });

      const postsRes = await fetch(
        `${baseUrl}/wp-json/wp/v2/posts?${params.toString()}`
      );

      if (!postsRes.ok)
        throw new Error(`Failed to fetch posts for author: ${user.slug}`);

      const posts = await postsRes.json();
      authorsPosts[user.slug] = posts;

      totalPagesPerAuthor[user.slug] = parseInt(
        postsRes.headers.get("X-WP-TotalPages") ?? "1"
      );
    })
  );

  return { authors: users, authorsPosts, totalPagesPerAuthor };
}

export async function getAuthorBySlug(
  slug: string,
  page: number = 1,
  perPage: number = 15
): Promise<{ author: Author | null; posts: Post[]; totalPages: number }> {
  const authorsRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/users?per_page=100`,
    {
      next: { revalidate: revalidateTime },
    }
  );

  if (!authorsRes.ok) throw new Error("Failed to fetch authors");

  const authors = await authorsRes.json();
  const author = authors.find((a: any) => a.slug === slug);

  if (!author) return { author: null, posts: [], totalPages: 0 };

  const firstPageParams = new URLSearchParams({
    author: author.id.toString(),
    per_page: perPage.toString(),
    page: "1",
    _embed: "true",
  });

  const firstPageRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?${firstPageParams.toString()}`
  );

  if (!firstPageRes.ok) return { author, posts: [], totalPages: 0 };

  const totalPages = parseInt(
    firstPageRes.headers.get("X-WP-TotalPages") ?? "1"
  );

  if (page > totalPages || page < 1) return { author, posts: [], totalPages };

  const params = new URLSearchParams({
    author: author.id.toString(),
    per_page: perPage.toString(),
    page: page.toString(),
    _embed: "true",
  });

  const postsRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?${params.toString()}`
  );

  if (!postsRes.ok) return { author, posts: [], totalPages };

  const posts = await postsRes.json();

  return { author, posts, totalPages };
}
