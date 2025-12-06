import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import AnimationWrapper from "../common/page-animation";
import bannerImg from "../assets/blog banner.png";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Editorjs from "@editorjs/editorjs";
import { tools } from "./Tools";
import { useNavigate } from "react-router-dom";
import { EditorContext } from "../pages/Editor";
import { userContext } from "../App";

export default function BloggEditor() {
  let {
    userAuth: { accessToken },
  } = useContext(userContext);

  let navigate = useNavigate();

  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  // initialize editor
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new Editorjs({
          holderId: "textEditor",
          data: content,
          tools: tools,
          placeholder: "Let's write an awesome story...",
        })
      );
    }
  }, []);

  const [bannerPreview, setBannerPreview] = useState(banner || bannerImg);
  const [isUploading, setIsUploading] = useState(false);

  // handle title typing
  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleTitleKeyDOwn = (e) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  // ⭐ Image Upload Handler (fixed)
  const handleBannerUpload = async (e) => {
    const img = e.target.files[0];
    if (!img) return;

    // show local preview
    setBannerPreview(URL.createObjectURL(img));
    setIsUploading(true);

    const loadingToast = toast.loading("Uploading…");

    const formData = new FormData();
    formData.append("file", img);
    formData.append("uploadedby", "blog_author@example.com");

    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.dismiss(loadingToast);

      // set the actual hosted URL
      setBannerPreview(res.data.url);
      setBlog({ ...blog, banner: res.data.url });

      toast.success("Banner uploaded!");
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Upload error:", err);
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // publish blog
  const handlePublishEvent = (e) => {
    e.preventDefault();

    if (!banner.length) return toast.error("Upload banner image to publish");

    if (!title.length) return toast.error("Please include a blog title");

    if (textEditor.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Write something before publishing");
        }
      });
    }
  };

  // save draft
  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) return;

    if (!title.length)
      return toast.error("Write blog title before saving draft");

    let loadingToast = toast.loading("Saving draft…");
    e.target.classList.add("disable");

    let blogObj = {
      title,
      banner,
      des,
      content,
      tags,
      draft: true,
    };

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Saved as draft");

        setTimeout(() => navigate("/"), 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.error(response.data.error);
      });
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/">
          <img src={logo} className="w-24 h-auto" loading="lazy" alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button
            className="btn-dark py-2 hover:bg-gray-500"
            onClick={handlePublishEvent}
          >
            Publish
          </button>
          <button
            className="btn-light btn-dark py-2 hover:bg-amber-500"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section className="md:mx-[20%]">
          <div className="max-w-[900px] w-full flex flex-col align-middle">
            <div className="relative aspect-video bg-white border-4 border-gray-500 hover:opacity-80">
              <label htmlFor="uploadBanner">
                {/* ⭐ use preview */}
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

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl border font-medium w-full h-20 outline-none resize-none bg-gray-300 mt-10 leading-tight placeholder:opacity-40 placeholder:text-center border-gray-300 pl-3 pr-3"
              onKeyDown={handleTitleKeyDOwn}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-1 border-b-black" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}
