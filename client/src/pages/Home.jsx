import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import userContext from "../context/userContext";
import { Nav } from "../components/Nav";
import Loader from "../components/Loader";

function Home() {
  const { user, loading, selectedChat } = useContext(userContext);
  return (
    <div className="flex flex-col h-screen p-1">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Nav />
          </div>
          <div className="flex md:space-x-3 mx-2 flex-grow overflow-y-auto">
            <div className="md:hidden w-full">
              {selectedChat ? <Chat/> : <SideBar/>}
            </div>
            <div className="md:block hidden w-2/6 h-full">
              <SideBar user={user} />
            </div>
            <span className="md:block hidden h-full border-l border-gray-500"></span>
            <div className="md:block hidden w-full h-full">
              <Chat />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
