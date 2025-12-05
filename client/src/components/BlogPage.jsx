import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/${id}`)
      .then((res) => {
        setBlog(res.data.blog);
        // console.log("BLOG CONTENT:", res.data.blog.content);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <Loader />;

  // Extract blocks from EditorJS content
  const blocks = blog.content?.[0]?.blocks || [];
  console.log(blocks);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Blog Banner */}
      {blog.banner && (
        <img
          src={blog.banner}
          alt="Blog Banner"
          className="w-full rounded-lg mb-6 object-cover"
        />
      )}

      {/* Blog Title */}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      {/* Blog Description */}
      <p className="text-gray-700 text-lg mb-6">{blog.des}</p>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={blog.author?.personal_info?.profile_img || "/default-avatar.png"}
          alt="Author"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="text-gray-700 font-medium">
          {blog.author?.personal_info?.fullname} @
          {blog.author?.personal_info?.username}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {blog.tags?.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
        <span>
          Published: {new Date(blog.publishedAt).toLocaleDateString()}
        </span>
        <span>Likes: {blog.activity?.total_likes}</span>
        <span>Comments: {blog.activity?.total_comments}</span>
      </div>

      {/* Blog Content */}
      <div className="blog-content">
        {blocks.map((block, index) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              );

            case "header":
              const Tag = `h${block.data.level}`;
              return (
                <Tag key={index} className="my-4 font-bold">
                  {block.data.text}
                </Tag>
              );

            case "list":
              if (block.data.style === "unordered") {
                return (
                  <ul key={index} className="list-disc ml-6 mb-4">
                    {block.data.items.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                );
              } else {
                return (
                  <ol key={index} className="list-decimal ml-6 mb-4">
                    {block.data.items.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ol>
                );
              }

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default BlogPage;
