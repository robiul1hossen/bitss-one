"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import BlogSkeleton from "./BlogSkeleton";

export default function Blog() {
  const location = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.blog.bfinit.com/api/v1/show_blog/34",
      );
      return await res.json();
    },
  });
  const blogs = data?.data?.data;

  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-10 mx-auto mt-28">
      <section className="mx-5 py-10 md:container md:mx-auto">
        <div className="flex justify-between">
          <h2 className="font-semibold text-brand md:text-2xl">
            Recent Blogs & Information
          </h2>
          {location.pathname === "/" && (
            <Link
              href={"/blogs"}
              className="rounded bg-brand px-4 py-2 text-white shadow"
            >
              View All
            </Link>
          )}
        </div>
        {isLoading ? (
          <BlogSkeleton />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {location.pathname === "/" ? (
              <>
                {data?.slice(0, 6)?.map((data, i) => (
                  <div key={i} className="flex flex-col rounded border">
                    <Image
                      width={1000}
                      height={1000}
                      src={data.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-auto w-full rounded-t"
                    />
                    <div className="mt-4 flex-1 px-4">
                      <h5 to="/" className="text-xl font-semibold line-clamp-2">
                        {data.title}
                      </h5>
                    </div>

                    <div className="p-4 text-right">
                      <Link
                        href={`/blogs/${data.custom_url}`}
                        className="inline-block w-fit self-start rounded bg-brand px-4 py-2 text-white"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {blogs?.map((data, i) => (
                  <div key={i} className="flex flex-col rounded border">
                    <Image
                      width={1000}
                      height={1000}
                      src={data.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-auto w-full rounded-t"
                    />
                    <div className="p-4">
                      <h5 to="/" className="text-xl font-semibold line-clamp-2">
                        {data.title}
                      </h5>
                      <Link
                        href={`/blogs/${data.custom_url}`}
                        className="inline-block mt-4 w-fit self-start rounded bg-red-600 hover:bg-red-700 px-4 py-2 text-white"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
