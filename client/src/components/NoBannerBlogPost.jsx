import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog, index }) => {
  let {
    blog_id,
    title,
    des,
    publishedAt,
    author: {
      personal_info: { fullname, profile_img },
    },
  } = blog;

  return (
    <Link
      to={`/blog/${blog_id}`}
      className="flex gap-5  border-b border-gray-300 pb-5 mb-5"
    >
      <h1 className="blog-index">{index < 10 ? `0${index + 1}` : index + 1}</h1>

      <div className="flex-1">
        <div className="flex items-start gap-2 mb-2">
          <img
            src={profile_img}
            alt="profile image"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1 text-sm">
            {fullname} | {getDay(publishedAt)}
          </p>
        </div>
        <h1 className="font-semibold leading-tight text-lg line-clamp-2">
          {title}
        </h1>
        <p className="text-sm text-grey mt-1 line-clamp-2">{des}</p>{" "}
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
