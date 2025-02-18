"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/Link";

interface IPagination {
  currentPage: number;
  totalPages: number;
}

function Pagination({ currentPage, totalPages }: IPagination) {
  const pathname = usePathname();
  // const segments = pathname.split("/");
  //   const lastSegment = segments[segments.length - 1];
  const basePath = pathname
    .replace(/^\//, "") // Remove leading slash
    .replace(/\/page\/\d+$/, ""); // Remove any trailing /page

  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!prevPage}
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
            }
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!nextPage}
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

export default Pagination;
