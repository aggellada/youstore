import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Loader2, Store } from "lucide-react";

function SignupPage() {
  const [showPassword, setShowPassword] = useState("password");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    signup(formData);
  };

  return (
    <div className="w-full h-screen pt-15 flex ">
      <div className="lg:px-4 w-full md:w-1/2 h-full flex justify-center items-center ">
        <div className=" p-4 md:p-12 lg:p-24 w-full h-full lg:h-fit lg:max-w-2xl flex flex-col justify-center items-center bg-base-200 lg:rounded-4xl">
          <div className="flex flex-col gap-2 mb-8 text-center items-center">
            <Store className="size-16 bg-base-100 p-2 rounded-xl" />
            <h1 className="font-bold text-2xl">Welcome to YouStore</h1>
            <h1 className="">Sign up to create your account!</h1>
          </div>
          <form className="p-4 w-full flex flex-col mb-4 gap-2 " onSubmit={handleFormSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-base-100 p-2 rounded-md border-1 border-gray-700"
              placeholder="John Doe"
            />
            <label htmlFor="username">Username</label>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-base-100 p-2 rounded-md border-1 border-gray-700"
              placeholder="johndoe"
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-base-100 p-2 rounded-md border-1 border-gray-700"
              placeholder="email@email.com"
            />
            <label htmlFor="password">Password</label>
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
                type={showPassword}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 w-full bg-base-100 p-2 rounded-md border-1 border-gray-700"
                placeholder="******"
              />
            </div>
            <button className="btn bg-base-300 hover:bg-base-300/60" type="submit">
              {isSigningUp ? <Loader2 className="animate-spin" /> : "Sign up"}
            </button>
          </form>
          <div className="text-center ">
            <span className="">
              Already have an account? <Link to="/login">Log in</Link>
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

export default SignupPage;
