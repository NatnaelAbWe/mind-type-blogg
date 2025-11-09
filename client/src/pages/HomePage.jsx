import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/InPageNavigation";
import heroImg from "../imgs/image-removebg-preview (6) 3.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import BlogPostCard from "../components/BlogPost";
import { useContext } from "react";
import { userContext } from "../App";
import MinimalBlogPost from "../components/NoBannerBlogPost";
import { activeTab } from "../components/InPageNavigation";

const HomePage = () => {
  const loadByCatagory = (e) => {
    let catgory = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState == catgory) {
      setPageState("home");
      return;
    }
    setPageState(catgory);
  };

  const {
    userAuth,
    userAuth: { accessToken },
  } = useContext(userContext);

  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");

  let catagories = [
    "programing",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finances",
    "travel",
  ];

  const fetchBLogsByCatagory = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tags: pageState,
      })
      .then((blogs) => {
        setBlogs(blogs.data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLatestBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then((blogs) => {
        // console.log(blogs.data.blogs);
        setBlogs(blogs.data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then((blogs) => {
        // console.log(blogs.data.blogs);
        setTrendingBlogs(blogs.data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTab.current.click();

    if (pageState === "home") {
      fetchLatestBlog();
    } else {
      fetchBLogsByCatagory();
    }
    if (!trendingBlogs) {
      fetchTrendingBlog();
    }
  }, [pageState]);
  const btnStyle =
    "border-0 w-full md:w-[35%] py-3 rounded-full bg-blue-500 text-2xl text-white text-center transition duration-300 ease-in-out active:bg-gray-500 active:animate-bounce";
  return (
    <AnimationWrapper className="cover flex flex-col">
      {/* hero section home page */}

      {accessToken ? (
        ""
      ) : (
        <div className="w-full flex flex-col justify-center items-center md:flex-row md:gap-8 border-b-2 border-gray-300">
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
      )}
      <section className="cover flex justify-center gap-10">
        {/* leatest bloggs */}
        <div className="w-full ">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      className={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>
            {trendingBlogs === null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    className={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost
                      blog={blog}
                      index={i}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            )}
          </InPageNavigation>
        </div>
        {/* filters and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-300 pl-8 max-md:hidden">
          <div className="flex flex-col gap-10 ">
            <div>
              <h1 className="font-medium text-xl mb-8 pt-6">
                stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {catagories.map((catagory, i) => {
                  return (
                    <button
                      className={
                        "tag " +
                        (pageState == catagory ? "bg-black text-white" : "")
                      }
                      key={i}
                      onClick={loadByCatagory}
                    >
                      {catagory}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs === null ? (
                <Loader />
              ) : (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      className={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost
                        blog={blog}
                        index={i}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
