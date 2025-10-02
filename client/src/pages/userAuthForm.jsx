import AnimationWrapper from "../common/page-animation";
import { useRef } from "react";
import { Link } from "react-router-dom";
import InputBox from "../components/Input";
import GoogleLogo from "../imgs/google.png";
import { Toaster, toast } from "react-hot-toast";

export default function UserAuthForm({ type }) {
  const AuthForm = useRef();
  function userAuthThroughServer(serverRoute, formData) {
    fetch(`http://localhost:3000/${type}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => console.log("server response:", data))
      .catch((err) => console.log("error:", err));
  }

  function handleSubmit(e) {
    e.preventDefault();

    let serverRoute = type === "signin" ? "/signin" : "/signup";

    let form = new FormData(AuthForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value.trim();
    }

    // form validation
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    let { fullname, email, password } = formData;

    if (type === "signup" && (!fullname || fullname.length < 3)) {
      return toast.error("Full Name must be at least 3 characters long.");
    }

    if (!email) {
      return toast.error("Enter an Email.");
    } else if (!emailRegex.test(email)) {
      return toast("Invalid Email format.");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 6–20 characters, include a number, lowercase and uppercase letter."
      );
    }

    //  Passed validation
    console.log("Form data ready to send:", formData);
    userAuthThroughServer(serverRoute, formData);
  }

  return (
    <AnimationWrapper>
      <section className="h-cover flex item-center justify-center">
        <Toaster />
        <form ref={AuthForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-glasio capitalize text-center mb-4 mt-4">
            {type === "signin" ? "Welcome Back" : "Join Us Today"}
          </h1>
          {type === "signup" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
              required
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="ff-rr-envelope"
            required
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="ff-rr-key"
            required
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type === "signin" ? "Sign In" : "Sign up"}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-15 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>Or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button className="btn-dark flex items-center gap-4 justify-center center">
            <img src={GoogleLogo} alt="Google logo" loading="lazy" />
            Continue With Google
          </button>
          {type === "signin" ? (
            <p className="my-5 text-center capitalize text-xl">
              I don't have an Account{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="my-5 text-center capitalize text-xl">
              I already have an Account{" "}
              <Link to="/signin" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
}
