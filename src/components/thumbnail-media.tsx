import { getFeaturedMediaById } from "@/lib/queries";
import Image from "next/image";

interface IThumbnailMedia {
  featuredMediaId: number;
}

async function ThumbnailMedia({ featuredMediaId }: IThumbnailMedia) {
  const featuredMedia =
    featuredMediaId === 0 ? null : await getFeaturedMediaById(featuredMediaId);

  if (!featuredMedia) return <></>;

  return (
    <Image
      style={{ objectFit: "cover" }}
      className="w-full h-full xl:w-[256px] xl:h-[166px] "
      src={
        featuredMedia.media_details?.sizes?.medium?.source_url ||
        featuredMedia.source_url!
      }
      height={1000}
      width={1000}
      alt=""
    />
  );
}

export default ThumbnailMedia;
