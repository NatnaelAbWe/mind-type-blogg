import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function BloggEditor() {
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
    </>
  );
}
