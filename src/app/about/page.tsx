import PageLayout from "@/components/layouts/page-layouts/page-layout";
import { getPageBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import parser, { DOMNode, Element } from "html-react-parser";

export default async function About() {
  const about = await getPageBySlug("about");

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

  if (!about) {
    return notFound();
  }

  return (
    <PageLayout content={about}>
      <div>{parser(about.content.rendered, { replace: replace })}</div>
    </PageLayout>
  );
}
