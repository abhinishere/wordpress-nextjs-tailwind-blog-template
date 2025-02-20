import { Metadata } from "next";
import siteMetadata from "@/config/site-metadata";
import { notFound } from "next/navigation";
import {
  getAllPostsReally,
  getAuthorById,
  getFeaturedMediaById,
  getPostBySlug,
} from "@/lib/queries";
import PostLayout from "@/components/layouts/post-layouts/post-layout";
import parser, { DOMNode, Element } from "html-react-parser";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const slug = decodeURI(params.slug);
  const post = await getPostBySlug(slug);

  if (!post) {
    return;
  }

  const authorId = post.author;
  const author = await getAuthorById(authorId);
  const authorList = [author];
  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.modified || post.date).toISOString();
  const authors = authorList.map((author) =>
    author ? author.name : "default"
  );
  let imageList = [siteMetadata.socialBanner];
  if (post.featured_media) {
    const featuredImage = await getFeaturedMediaById(post.featured_media);
    if (featuredImage) imageList = [featuredImage.source_url];
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes("http") ? img : siteMetadata.siteUrl + img,
    };
  });

  return {
    title: post.title.rendered,
    description: post.excerpt.rendered,
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: post.excerpt.rendered,
      images: imageList,
    },
  };
}

export const generateStaticParams = async () => {
  const allPosts = await getAllPostsReally();

  const allSlugs = allPosts.allPosts.map((p) => ({
    slug: p.slug,
  }));

  return allSlugs;
};

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const mapping: Record<string, string> = {
    h1: "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
    h2: "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
    h5: "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
    h6: "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
    a: "font-medium underline underline-offset-4",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    ul: "my-6 ml-6 list-disc",
    ol: "my-6 ml-6 list-decimal",
    li: "mt-2",
    blockquote: "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
    img: "rounded-md border",
    hr: "my-4 md:my-8",
    table: "w-full",
    tr: "m-0 border-t p-0 even:bg-muted",
    th: "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
    td: "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
    pre: "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
    code: "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
  };

  const replace = (domNode: DOMNode): DOMNode | null => {
    if (domNode.type === "tag" && "name" in domNode) {
      const element = domNode as Element;
      const className = mapping[element.name];

      if (className && element.attribs) {
        element.attribs.class = className;
      }

      return element;
    }

    return null;
  };

  const params = await props.params;
  const slug = decodeURI(params.slug);
  // Filter out drafts in production
  const currentPost = await getPostBySlug(slug);

  if (!currentPost) {
    return notFound();
  }

  const prev = undefined;
  const next = undefined;
  const author = await getAuthorById(currentPost.author);

  const jsonLd = {
    // add other data
    author: { "@type": "Person", name: author ? author.name : "default" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={currentPost} author={author} next={next} prev={prev}>
        <div>{parser(currentPost.content.rendered, { replace: replace })}</div>
      </PostLayout>
    </>
  );
}
