import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Auth({ token }) {
  const [toggle, SetToggle] = useState(true);
  return (
    <div className="transition-all">
      {toggle ? (
        <Login toggle={SetToggle} settoken={token} />
      ) : (
        <Signup toggle={SetToggle} settoken={token} />
      )}
    </div>
  );
}

export default Auth;
