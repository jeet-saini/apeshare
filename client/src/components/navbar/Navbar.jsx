import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from   'react-router-dom';
import { useHistory } from "react-router-dom";
export const Navbar = () => {
    const { user } = useContext(AuthContext);
    const history = useHistory();
  
    const logout = ()=>{
      if(user){
        localStorage.removeItem("user");
        history.push("/");
        window.location.reload();
      }
    };

  return (
    <div className="navbar">
    <div className="left" >
      <img className='logo' src="https://firebasestorage.googleapis.com/v0/b/college-project-fb8cf.appspot.com/o/Monk%20Share%20(1).svg?alt=media&token=db65d238-9882-45c6-9686-44b87ebbadf4" alt="logo" />
      <div className="menu">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="home">Home</div>
        </Link>
        <Link to={`/${user.username}`} style={{ textDecoration: "none" }}>
          <div>Profile</div>
        </Link>

      </div>
    </div>
    <div className="logout" onClick={logout}  >Logout</div>
  </div>
  )
}
