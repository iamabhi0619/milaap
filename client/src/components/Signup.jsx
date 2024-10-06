import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import userContext from "../context/userContext";

function Signup({ toggle }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    cpassword: "",
    name: "",
  });
  const {setToken} = useContext(userContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.cpassword) {
      toast.warn("Passwords do not match!");
      return;
    }
    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      name: formData.name,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Signup successful");
        localStorage.setItem("user", data.token);
        setToken(data.token);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup", error);
      toast.error("An error occurred during signup");
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
          className="bg-navyBlue-normal text-color-blue rounded-lg shadow-xl overflow-hidden text-silver-light"
        >
          <div className="p-8">
            <h2 className="text-center text-4xl font-semibold truncate">
              Create an account
            </h2>
            <p className="mt-4 text-center text-orange-normal text-xl">
              Signup to continue
            </p>
            <form
              method="POST"
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div className="rounded-md shadow-sm">
                <div>
                  <label className="sr-only" htmlFor="name">
                    Name
                  </label>
                  <input
                    placeholder="Full Name"
                    className="appearance-none relative block w-full px-3 py-3 border rounded-md bg-skyBlue-normal text-navyBlue-dark text-xl truncate focus:bg-gray-light focus:text-navyBlue-dark"
                    required
                    autoComplete="name"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4">
                  <label className="sr-only" htmlFor="email">
                    Email address
                  </label>
                  <input
                    placeholder="Email address"
                    className="appearance-none relative block w-full px-3 py-3 border rounded-md bg-skyBlue-normal text-navyBlue-dark text-xl truncate focus:bg-gray-light focus:text-navyBlue-dark"
                    required
                    autoComplete="email"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4">
                  <label className="sr-only" htmlFor="userId">
                    User Id
                  </label>
                  <input
                    placeholder="User Id"
                    className="appearance-none relative block w-full px-3 py-3 border rounded-md bg-skyBlue-normal text-navyBlue-dark text-xl truncate focus:bg-gray-light focus:text-navyBlue-dark"
                    required
                    autoComplete="id"
                    type="text"
                    name="username"
                    id="userId"
                    value={formData.userId}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4">
                  <label className="sr-only" htmlFor="password">
                    Password
                  </label>
                  <input
                    placeholder="Password"
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-700 rounded-md bg-skyBlue-normal text-navyBlue-dark text-xl truncate focus:bg-gray-light focus:text-navyBlue-dark"
                    required
                    autoComplete="current-password"
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4">
                  <label className="sr-only" htmlFor="cpassword">
                    Confirm Password
                  </label>
                  <input
                    placeholder="Retype Password"
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-700 rounded-md bg-skyBlue-normal text-navyBlue-dark text-xl truncate focus:bg-gray-light focus:text-navyBlue-dark"
                    required
                    autoComplete="current-password"
                    type="password"
                    name="cpassword"
                    id="cpassword"
                    value={formData.cpassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button className="relative inline-block mt-2 p-px font-semibold leading-5 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-navyBlue-light transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                  <span className="relative z-10 block px-6 py-3 rounded-xl bg-orange-light">
                    <div className="relative z-10 flex items-center space-x-2">
                      <span className="transition-all duration-500 group-hover:translate-x-1 text-xl">
                        Create...!!
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
          <div className="px-8 py-4 text-center text-lg md:text-xl">
            <span className="text-gray-400">Already have an account? </span>
            <p
              className="font-medium text-orange-light hover:text-orange-normal hover:underline"
              onClick={() => {
                toggle(true);
              }}
            >
              Log in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
