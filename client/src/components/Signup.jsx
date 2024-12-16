import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import userContext from "../context/userContext";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import { FaAngleDoubleRight } from "react-icons/fa";

function Signup({ toggle }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    cpassword: "",
    name: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(`https://res.cloudinary.com/milaap-0619/image/upload/v1728314866/defult-avtar_dloo09.jpg`);
  const { setToken } = useContext(userContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {};
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
    <div className="flex items-center justify-center h-screen font-normal my-auto">
      <div className="max-w-lg w-full mx-2">
        <div className="dark:bg-blue-lightDark px-4 py-2 text-color-blue rounded-lg shadow-xl overflow-hidden text-blue-light">
          <div className="">
            <h2 className="text-center text-2xl font-semibold truncate">
              Create an account
            </h2>
            <p className="mt-2 text-center text-lg">Signup to continue</p>
            <form
              method="POST"
              onSubmit={handleSubmit}
              className="mt-8 space-y-4 font-simple font-bold"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex justify-center items-center">
                  <div className="w-24 md:w-36 h-24 md:h-36 rounded-full p-1 border-2 border-blue-light box-content relative">
                    <img
                      src={imageUrl}
                      alt=""
                      className="rounded-full md:h-36 md:w-36 object"
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-col">
                      <label
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer "
                        htmlFor="file-upload"
                      >
                        <FaPlus size={40} />
                        <span className="mt-2 text-sm">Upload DP</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div>
                    <label className="sr-only" htmlFor="name">
                      Name
                    </label>
                    <input
                      placeholder="Full Name"
                      className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-bold tracking-wider py-1 bg-transparent outline-none border-b-2"
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
                    <label className="sr-only" htmlFor="userId">
                      User Id
                    </label>
                    <input
                      placeholder="User Id"
                      className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-bold tracking-wider py-1 bg-transparent outline-none border-b-2"
                      required
                      autoComplete="id"
                      type="text"
                      name="username"
                      id="userId"
                      value={formData.userId}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>
                <input
                  placeholder="Email address"
                  className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-bold tracking-wider py-1 bg-transparent outline-none border-b-2"
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
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <input
                  placeholder="Password"
                  className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-bold tracking-wider py-1 bg-transparent outline-none border-b-2"
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
                  className="appearance-none relative block w-full px-2 text-blue-light placeholder-blue-light font-bold tracking-wider py-1 bg-transparent outline-none border-b-2"
                  required
                  autoComplete="current-password"
                  type="password"
                  name="cpassword"
                  id="cpassword"
                  value={formData.cpassword}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="relative flex items-center gap-2 px-4 py-2 text-xl mt-2 font-medium text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-blue-dark ease-in-out hover:scale-105 active:scale-95 hover:gap-3 transition-all duration-300"
                >
                  <p className="font-bold tracking-wide">Create..!!</p>
                  <FaAngleDoubleRight />
                </button>
              </div>
            </form>
          </div>
          <div className="px-8 py-4 text-center">
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
