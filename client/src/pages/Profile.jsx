import React from "react";
import EditProfile from "../components/EditProfile";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const handelExit = () =>{
    navigate('/')
  }
  return (
    <div className="h-screen bg-white">
      <div className="px-10 py-10 flex items-center justify-between">
        <p className="text-3xl font-bold tracking-widest">
          Hello <span className="text-orange-normal">Abhishek Kumar...!!</span>
        </p>
        <button onClick={handelExit}>
          <ImCross />
        </button>
      </div>
      <div className="flex gap-3 w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center w-3/12 text-center mx-3">
          <div>
            <img
              src="https://avatar.iran.liara.run/public/boy?username=Scott"
              alt="User_Img"
              className="w-52 h-52"
            />
          </div>
          <div className="font-semibold">
            <p className="text-3xl ">Abhishek Kumar</p>
            <p>An Aspiring software devloper...!!</p>
          </div>
        </div>
        <div className=" w-full">
          <EditProfile />
        </div>
      </div>
    </div>
  );
}

export default Profile;
