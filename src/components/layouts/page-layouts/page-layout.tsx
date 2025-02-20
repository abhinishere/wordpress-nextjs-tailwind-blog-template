import { ReactNode } from "react";
import PageTitle from "@/components/page-title";
import SectionContainer from "@/components/section-container";
import ScrollTopAndComment from "@/components/scroll-top-and-comment";
import { Page } from "@/lib/types";

interface LayoutProps {
  content: Page;
  children: ReactNode;
}

export default function PageLayout({ content, children }: LayoutProps) {
  const { title } = content;

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="">
              <PageTitle>{title.rendered}</PageTitle>
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none pt-10 pb-8">
            {children}
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
