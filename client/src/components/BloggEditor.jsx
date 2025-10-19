import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import AnimationWrapper from "../common/page-animation";
import banner from "../assets/blog banner.png";
import { useState } from "react";
import axios from "axios";

export default function BloggEditor() {
  const [bannerPreview, setBannerPreview] = useState(banner);
  const [isUploading, setIsUploading] = useState(false);

  const handleBannerUpload = async (e) => {
    const img = e.target.files[0];
    if (!img) return;

    // show local preview immediately
    setBannerPreview(URL.createObjectURL(img));
    setIsUploading(true);

    // prepare form data for upload
    const formData = new FormData();
    formData.append("file", img);
    formData.append("uploadedby", "blog_author@example.com");

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // replace preview with the actual uploaded URL
      setBannerPreview(res.data.url);
      console.log("✅ Uploaded banner URL:", res.data.url);
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
                {/* dynamic banner preview */}
                <img
                  src={bannerPreview}
                  alt="blog banner"
                  className="z-20 w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white">
                    Uploading...
                  </div>
                )}
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
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
