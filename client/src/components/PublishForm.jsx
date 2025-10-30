import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import { useContext } from "react";
import { EditorContext } from "../pages/Editor";

export default function PublishForm() {
  let {
    setEditorState,
    blog,
    blog: { title, banner, content, tags, des },
  } = useContext(EditorContext);

  const backToEditor = (e) => {
    e.preventDefault();
    setEditorState("editor");
  };
  return (
    <AnimationWrapper>
      <section>
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[3%] lg:top-[10%]"
          onClick={backToEditor}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="max-w-[550px] center">
          <p className="">preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray items-center mt-4">
            <img src={banner} alt="blogg image" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2 ">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
          <div className="border-gray lg:border-1 lg:pl-8">
            <p>blog Title</p>
            <input type="text" placeholder="blogg title" defaultValue={title} />
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}
