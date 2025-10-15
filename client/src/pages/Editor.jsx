import { useContext } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";

export default function Editor() {
  const {
    userAuth: { accessToken },
  } = useContext(userContext);
  return (
    <div>
      {accessToken === null ? (
        <Navigate to="/signin" />
      ) : (
        <h1>You Can Access the Editor Page</h1>
      )}
    </div>
  );
}
