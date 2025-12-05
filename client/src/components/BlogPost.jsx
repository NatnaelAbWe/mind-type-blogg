import { Link } from "react-router-dom";
import { getDay } from "../common/date";
// import defaultI from "../assets/404.png";

const BlogPostCard = ({ content, author }) => {
  console.log(content);
  console.log(author);
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullName, profile_img, username } = author;
  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-b pb-5 mb-4 border-gray-300"
    >
      <div className="w-full flex-1">
        <div className="flex items-center gap-2 mb-7">
          <img
            src={profile_img}
            alt="author"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1 text-sm font-medium">
            {fullName} @ {username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h2 className="blog-title">{title}</h2>
        <p className="text-gray-500 my-3 font-gelasio text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="flex items-center gap-4 mt-7">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            {tags[0]}
          </span>
          <span className="ml-3 flex items-center gap-2">
            <i className="fi fi-rr-heart"></i>
            {total_likes}
          </span>
        </div>
      </div>
      <div className="h-28 aspect-square mt-2 bg-gray-400">
        <img
          src={banner || defaultI}
          alt="banner"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
