import { useContext } from "react";
import { EditorContext } from "../pages/Editor";

const Tag = ({ tag, index }) => {
  const {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  const handleTagRemove = () => {
    const updatedTags = tags.filter((t) => t !== tag);
    setBlog({ ...blog, tags: updatedTags });
  };

  const handleTagChange = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      const currentTag = e.target.innerText.trim().replace(/,$/, "");

      if (currentTag.length > 0) {
        const updatedTags = [...tags];
        updatedTags[index] = currentTag;
        setBlog({ ...blog, tags: updatedTags });
      }
    }
  };

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.setAttribute("suppressContentEditableWarning", false);

    e.target.focus();
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:opacity-50 pr-8">
      <p
        className="outline-none"
        onKeyDown={handleTagChange}
        onClick={addEditable}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2 hover:bg-red-500"
        onClick={handleTagRemove}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none" />
      </button>
    </div>
  );
};

export default Tag;
