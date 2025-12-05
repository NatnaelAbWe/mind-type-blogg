import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogPage = () => {
  const { id } = useParams(); // gets blog id from URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/${id}`)
      .then((res) => setBlog(res.data.blog)) // adjust based on your API
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      {!blog ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{blog.title}</h1>
          <p>{blog.des}</p>
          <img src={blog.banner || "/default-banner.png"} alt="blog banner" />
          <p>Published: {blog.publishedAt}</p>
          <p>Likes: {blog.activity?.total_likes || 0}</p>
        </>
      )}
    </div>
  );
};

export default BlogPage;
