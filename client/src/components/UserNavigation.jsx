import { useContext } from "react";
import { userContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { logOutUser, removeFromSession } from "../common/session";

export default function UserNavigationPanel() {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(userContext);

  function signOutUser() {
    removeFromSession("user");
    setUserAuth({ accessToken: null });
  }
  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-gray-50 w-60 duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <p>Write</p>
          <i className="fi fi-sr-pen-clip"></i>
        </Link>
        <Link
          to={`/user/${username}`}
          className="link pl-8 py-4 border-t-2 hover:bg-amber-400"
        >
          Profile
        </Link>
        <Link to="/dashboard/blogs" className="link pl-8 py-4 border-t-2">
          Dashboard
        </Link>
        <Link to="/settings/edit-profile" className="link pl-8 py-4 border-t-2">
          Settings
        </Link>
        <span className="absolute border-t border-gray w-[100%]"></span>
        <button
          className="text-left p-4 hover:bg-gray w-full pl-8 py-4 hover:bg-red-400"
          onClick={signOutUser}
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p className="text-gray-700">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
}
