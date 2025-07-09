import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Loader2, Store } from "lucide-react";

function LoginPage() {
  const [showPassword, setShowPassword] = useState("password");
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login, isLogginIn } = useAuthStore();

  const handleLoginBtn = (e) => {
    e.preventDefault();

    const formData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    login(formData);
  };

  return (
    <div className="w-full h-screen pt-15 flex ">
      <div className="lg:px-4 w-full md:w-1/2 h-full flex justify-center items-center ">
        <div className=" p-4 md:p-12 lg:p-24 w-full h-full lg:h-fit lg:max-w-2xl flex flex-col justify-center items-center bg-base-200 lg:rounded-4xl">
          <div className="flex flex-col gap-2 mb-8 text-center items-center">
            <Store className="size-16 bg-base-100 p-2 rounded-xl" />
            <h1 className="font-bold text-2xl">Welcome to YouStore</h1>
            <h1 className="">Sign in to your account!</h1>
          </div>
          <form action="" className="p-4 w-full flex flex-col mb-4 gap-2 ">
            <label htmlFor="">Email</label>
            <input
              type="text"
              ref={emailRef}
              className="bg-base-100 p-2 rounded-md border-1 border-gray-700"
              placeholder="email@email.com"
            />
            <label htmlFor="">Password</label>
            <div className="flex items-center">
              {showPassword === "password" ? (
                <Eye
                  onClick={() => setShowPassword("text")}
                  className="absolute left-10 md:left-20 lg:left-35 xl:left-37 2xl:left-67"
                />
              ) : (
                <EyeOff
                  onClick={() => setShowPassword("password")}
                  className="absolute left-10 md:left-20 lg:left-35 xl:left-37 2xl:left-67"
                />
              )}
              <input
                type={showPassword === "password" ? "text" : "password"}
                ref={passwordRef}
                className="pl-12 w-full bg-base-100 p-2 rounded-md border-1 border-gray-700"
                placeholder="******"
              />
            </div>
            <button className="btn bg-base-300 hover:bg-base-300/60" onClick={handleLoginBtn}>
              {isLogginIn ? <Loader2 className="animate-spin" /> : "Log in"}
            </button>
          </form>
          <div className="text-center ">
            <span className="">
              Don't have an account yet? <Link to="/signin">Sign in</Link>
            </span>
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-1/2 md:px-8 h-full bg-base-300 justify-center items-center">
        <div className="max-w-md w-full text-center flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3 ">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-primary/10 ${i % 2 === 0 ? "animate-pulse" : ""}`}
              />
            ))}
          </div>
          <h1 className="font-bold text-4xl">Welcome back!</h1>
          <h1 className="text-md">Sign in to buy items from our store!</h1>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
