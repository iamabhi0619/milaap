import React, { useState } from "react";
import {
  FaEdit,
  FaWindowClose,
  FaBirthdayCake,
  FaFemale,
  FaMale,
} from "react-icons/fa";
import { TbSwitch3 } from "react-icons/tb";

function EditProfile() {
  const data = {
    username: "iamabhi0619",
    email: "iamabhishek0619@gmail.com",
    fullName: "Abhishek Kumar",
    birthday: "2024-09-04",
    bio: "An Aspiring software devloper..!!",
    gender: "male",
  };

  const [formData, setFormData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form
        className="flex flex-col p-8 rounded-lg shadow-lg w-full mx-8 gap-2"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center text-2xl font-bold text-center">
          <h2 className="">Edit Profile</h2>
          <button type="button" onClick={handleEditToggle} className="">
            {isEditing ? <FaWindowClose /> : <FaEdit />}
          </button>
        </div>
        <div className="flex w-full justify-between gap-10">
          {/* Username */}
          <div className="flex flex-col gap-1 mb-4 w-1/2">
            <label className="text-lg font-semibold" htmlFor="username">
              User Name
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                !isEditing && "bg-gray-200"
              }`}
            />
          </div>
          {/* name */}
          <div className="flex flex-col gap-1 mb-4 w-1/2">
            <label className="text-lg font-semibold" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                !isEditing && "bg-gray-200"
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-lg font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            readOnly="true"
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing && "bg-gray-200"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-lg font-semibold" htmlFor="bio">
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            readOnly={!isEditing}
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing && "bg-gray-200"
            }`}
          />
        </div>
        <div className="flex justify-center items-center gap-10">
          <div className="flex flex-col gap-2 mb-1 px-6 py-2 w-1/2">
            <label
              className="flex items-center justify-between text-xl font-semibold"
              htmlFor="birthday"
            >
              <p>Birthday</p>
              <FaBirthdayCake />
            </label>
            <input
              type="date"
              name="birthday"
              id="birthday"
              onChange={handleChange}
              value={formData.birthday}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              style={{ backgroundColor: isEditing ? "white" : "#e2e8f0" }}
              readOnly={!isEditing}
            />
          </div>

          <div className="flex items-center w-1/2">
            <div className="flex flex-col gap-2 mb-1 px-6 py-2 rounded-xl pb-5">
              <label
                className="flex items-center justify-between text-xl font-semibold"
                htmlFor="gender"
              >
                Gender:- {formData.gender.toUpperCase()}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex h-[50px] w-[50px] items-center justify-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                    disabled={!isEditing}
                    checked={formData.gender === "male"}
                    className="peer z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="absolute h-full w-full rounded-full bg-blue-100 p-4 shadow-sm shadow-[#00000050] ring-blue-400 duration-300 peer-checked:scale-110 peer-checked:ring-2" />
                  <div className="absolute -z-10 h-full w-full scale-0 rounded-full bg-blue-200 duration-500" />
                  <FaMale className="absolute fill-blue-400" size={24} />
                </div>
                <div className="relative flex h-[50px] w-[50px] items-center justify-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                    disabled={!isEditing}
                    checked={formData.gender === "female"}
                    className="peer z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="absolute h-full w-full rounded-full bg-pink-100 p-2 shadow-sm shadow-[#00000050] ring-pink-400 duration-300 peer-checked:scale-110 peer-checked:ring-2" />
                  <div className="absolute -z-10 h-full w-full scale-0 rounded-full bg-pink-200 duration-500 peer-checked:scale-[500%]" />
                  <FaFemale className="absolute fill-pink-400" size={24} />
                </div>
                <div className="relative flex h-[50px] w-[50px] items-center justify-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    onChange={handleChange}
                    disabled={!isEditing}
                    checked={formData.gender === "other"}
                    className="peer z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="absolute h-full w-full rounded-full bg-neutral-100 p-2 shadow-sm shadow-[#00000050] ring-neutral-400 duration-300 peer-checked:scale-110 peer-checked:ring-2" />
                  <div className="absolute -z-10 h-full w-full scale-0 rounded-full bg-neutral-200 duration-500" />
                  <TbSwitch3 className="absolute fill-neutral-400" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {isEditing && (
          <button
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-200 mb-2"
            type="submit"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

export default EditProfile;
