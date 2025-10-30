import { createContext, useContext, useState } from "react";
import { userContext } from "../App";
import banner from "../assets/blog banner.png";
import { Navigate } from "react-router-dom";
import PublishForm from "../components/PublishForm";
import BloggEditor from "../components/BloggEditor";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  autor: { personal_info: {} },
};

export const EditorContext = createContext({});

export default function Editor() {
  const [editorState, setEditorState] = useState("editor");
  const [blog, setBlog] = useState(blogStructure);
  const [textEditor, setTextEditor] = useState({ isReady: false });

  const {
    userAuth: { accessToken },
  } = useContext(userContext);
  return (
    <div>
      <EditorContext.Provider
        value={{
          blog,
          setBlog,
          editorState,
          setEditorState,
          textEditor,
          setTextEditor,
        }}
      >
        {accessToken === null ? (
          <Navigate to="/signin" />
        ) : editorState == "editor" ? (
          <BloggEditor />
        ) : (
          <PublishForm />
        )}
      </EditorContext.Provider>
    </div>
  );
}
