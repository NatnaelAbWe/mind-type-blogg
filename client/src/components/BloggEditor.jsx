import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import AnimationWrapper from "../common/page-animation";
import banner from "../assets/blog banner.png";

export default function BloggEditor() {
  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    console.log(img);
  };
  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img src={logo} className="w-24 h-auto" loading="lazy" alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          New Blogg
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2 hover:bg-gray-500">Publish</button>
          <button className="btn-light btn-dark py-2 hover:bg-amber-500">
            Save Draft
          </button>
        </div>
      </nav>
      <AnimationWrapper>
        <section className="md:mx-[20%]">
          <div className="max-w-[900px] w-full flex align-middle">
            <div className="relative aspect-video bg-white border-4 border-gray-500 hover:opacity-80">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  className="z-20
                "
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png .jpg .jpeg"
                  className="bg-gray-400"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}
