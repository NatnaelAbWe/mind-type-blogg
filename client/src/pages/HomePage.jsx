import { useEffect } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/InPageNavigation";
import heroImg from "../imgs/image-removebg-preview (6) 3.svg";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const fetchLatestBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then((blogs) => {
        console.log(blogs.data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlog();
  }, []);
  const btnStyle =
    "border-0 w-full md:w-[35%] py-3 rounded-full bg-blue-500 text-2xl text-white text-center transition duration-300 ease-in-out active:bg-gray-500 active:animate-bounce";

  return (
    <AnimationWrapper>
      <section className="cover flex flex-col justify-center gap-10">
        {/* hero section home page */}
        <div className="w-full flex flex-col justify-center items-center md:flex-row md:gap-8">
          <div>
            <h1 className="font-gelasio font-bold text-center text-3xl my-4 md:text-6xl">
              MIND TYPE
            </h1>
            <p className="text-xl md:text-2xl text-center py-3">
              A blogging platform where every story finds its space.
              <br /> Designed with accessibility at its core, so your voice
              reaches everyone, everywhere.
            </p>
            <div className="flex flex-col items-center justify-center md:flex-row gap-4 mt-10">
              <Link to="/signin" className={btnStyle}>
                Sign In
              </Link>
              <Link to="/signup" className={btnStyle}>
                Sign Up
              </Link>
            </div>
          </div>
          <img
            src={heroImg}
            calt="Hero illustration"
            className="w-2/3 md:w-1/3 max-w-md"
            loading="lazy"
          />
        </div>
        <hr className="text-gray-300 text-2xl mt-10" />
        {/* leatest bloggs */}
        <div className="w-full ">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          ></InPageNavigation>
        </div>
        {/* filters and trending blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
