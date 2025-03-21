import { getFeaturedMediaById } from "@/lib/queries";
import Image from "next/image";
import React from "react";

interface IFeaturedMedia {
  mediaId: number;
}

async function FeaturedMedia({ mediaId }: IFeaturedMedia) {
  const featuredMedia =
    mediaId === 0 ? null : await getFeaturedMediaById(mediaId);
  if (!featuredMedia) return <></>;

  return (
    <Image
      style={{ objectFit: "cover" }}
      className="w-full h-full  xl:h-[500px] "
      src={
        featuredMedia.media_details?.sizes?.large?.source_url ||
        featuredMedia.source_url!
      }
      height={1000}
      width={1000}
      alt=""
    />
  );
}

export default FeaturedMedia;
