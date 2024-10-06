import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import userContext from "./context/userContext";

function App() {
  const { user } = useContext(userContext);
  return (
    <div className="App dark:bg-blue-dark">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      {user ? <Home /> : <Auth />}
    </div>
  );
}

export default App;
