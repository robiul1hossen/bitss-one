import BlogDetails from "@/components/pages/blog/BlogDetails";

export default async function page({ params }) {
  const { slug } = await params;
  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-10 mx-auto">
      <BlogDetails slug={slug} />
    </div>
  );
}
