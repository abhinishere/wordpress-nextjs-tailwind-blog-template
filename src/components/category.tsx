import Link from "next/link";

interface Props {
  name: string;
  slug: string;
}

const Category = ({ name, slug }: Props) => {
  return (
    <Link
      href={`/category/${slug}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
      dangerouslySetInnerHTML={{ __html: name }}
    ></Link>
  );
};

export default Category;
