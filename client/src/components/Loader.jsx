import React from "react";
const Loader = () => {
  return (
    <div className="relative flex-col gap-4 w-full flex items-center justify-center my-auto">
      <div className="w-40 h-40 border-4 animate-spin border-transparent border-t-blue-light rounded-full duration-300">
        
      </div>
      <div className="absolute animate-pulse">
        <img src="asset\MILAAP_logo.png" alt=""  className="w-28 h-28"/>
      </div>
    </div>
  );
};

export default Loader;
