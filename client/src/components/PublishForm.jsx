import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import { useContext } from "react";
import { EditorContext } from "../pages/Editor";
import Tag from "./Tag";

export default function PublishForm() {
  const charLim = 250;
  let {
    setEditorState,
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
  } = useContext(EditorContext);

  const backToEditor = (e) => {
    e.preventDefault();
    setEditorState("editor");
  };
  const handleTitleChange = (e) => {
    e.preventDefault();
    let input = e.target;
    console.log(input);
    setBlog({ ...blog, title: input.value });
  };

  const handleDisChange = (e) => {
    e.preventDefault();
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };

  const handleTitleKeyDOwn = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center grid-rows-1 lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={backToEditor}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="max-w-[550px] center">
          <p className="">preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-500 items-center mt-4">
            <img src={banner} alt="blogg image" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2 ">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>
        <div className="lg:pl-8">
          <p>blog Title:</p>
          <input
            type="text"
            placeholder="blogg title"
            defaultValue={title}
            className="input-box"
            onChange={handleTitleChange}
          />

          <p className="text-dark-gray mb-2 mt-9">
            Short description about your blog:
          </p>
          <textarea
            className="h-40 resize-none leading-7 input-box pl-4"
            maxLength={charLim}
            defaultValue={des}
            onChange={handleDisChange}
            onKeyDown={handleTitleKeyDOwn}
          ></textarea>
          <p className="mt-1 text-dark-gray text-sm text-rig">
            {charLim - des.length}/200
          </p>
          <p>Topics - (Helps is searching and ranking your blog post)</p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="topics"
              className="sticy input-box bg-white top-0 left-0 pl-4 mb-3"
            />
            <Tag tag="Testing Tag" />
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}
