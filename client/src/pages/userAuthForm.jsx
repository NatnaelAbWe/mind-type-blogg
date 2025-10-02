import AnimationWrapper from "../common/page-animation";
import { useRef } from "react";
import { Link } from "react-router-dom";
import InputBox from "../components/Input";
import GoogleLogo from "../imgs/google.png";
export default function UserAuthForm({ type }) {
  const AuthForm = useRef();
  return (
    <AnimationWrapper>
      <section className="h-cover flex item-center justify-center">
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
            // onClick={handleSubmit}
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
