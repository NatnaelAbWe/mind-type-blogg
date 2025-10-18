import { useContext, useState } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";
import PublishForm from "../components/PublishForm";
import BloggEditor from "../components/BloggEditor";

export default function Editor() {
  const [editorState, setEditorState] = useState("editor");

  const {
    userAuth: { accessToken },
  } = useContext(userContext);
  return (
    <div>
      {accessToken === null ? (
        <Navigate to="/signin" />
      ) : editorState == "editor" ? (
        <BloggEditor />
      ) : (
        <PublishForm />
      )}
    </div>
  );
}
