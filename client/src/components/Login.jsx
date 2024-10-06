import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import userContext from "../context/userContext";

function Login({ toggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {setToken} = useContext(userContext);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password }
      );
      const data = response.data;
      if (data.success) {
        const { token } = data;
        toast.success("Login successful!");
        localStorage.setItem("user", token);
        setToken(token)
      } else {
        toast.warn(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response
          ? error.response.data.message
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-normal">
      <div className="max-w-lg w-full mx-2">
        <div
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          className="bg-blue-lightDark text-color-blue rounded-lg shadow-xl overflow-hidden p-6"
        >
          <div className="">
            <h2 className="text-center text-3xl font-semibold truncate text-blue-light">
              Welcome Back
            </h2>
            <p className="mt-4 text-center text-blue-light font-semibold text-lg">
              Sign in to continue
            </p>
            <form
              method="POST"
              className="mt-8 space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="rounded-md shadow-sm">
                <div>
                  <label className="sr-only" htmlFor="email">
                    Email address
                  </label>
                  <input
                    placeholder="User Id or Email"
                    className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-semibold tracking-wider py-1 bg-transparent outline-none border-b-2"
                    required
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="sr-only" htmlFor="password">
                    Password
                  </label>
                  <input
                    placeholder="Password"
                    className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-semibold tracking-wider py-1 bg-transparent outline-none border-b-2"
                    required
                    autoComplete="current-password"
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    className="h-5 w-5 border-orange-normal px-2 border-2 text-navyBlue-dark focus:ring-orange-normal rounded"
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                  />
                  <label
                    className="ml-2 block text-gray-dark"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    className="font-light text-gray-normal hover:text-gray-dark hover:underline"
                    href="/"
                  >
                    Forgot your password ?
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="relative inline-block mt-2 font-medium text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-blue-dark transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                  disabled={loading}
                >
                  <span className="relative z-10 block px-6 py-2 rounded-xl">
                    <div className="relative z-10 flex items-center space-x-2">
                      <span className="transition-all duration-500 group-hover:translate-x-1 text-xl">
                        {loading ? "Logging in..." : "Login...!!"}
                      </span>
                      <svg
                        className="w-8 h-8 transition-transform duration-500 group-hover:translate-x-1"
                        data-slot="icon"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </span>
                </button>
              </div>
            </form>
          </div>
          <div className="px-8 py-4 text-center mt-4">
            <span className="text-gray-400">Don&apos;t have an account? </span>
            <p
              className="font-medium text-orange-light hover:text-orange-normal hover:underline"
              onClick={() => toggle(false)}
            >
              Sign up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
