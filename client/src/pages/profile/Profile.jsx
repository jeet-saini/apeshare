import "./profile.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Navbar } from "../../components/navbar/Navbar";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
       <div className="home">
         <Navbar />
      <div className="main">
        <div className="mainLeft">
        <Sidebar user={user} />

        </div>
        <div className="feed">
        <Feed  username={user.username}/>

        </div> 
      </div>
       
    </div>
    </>
  );
}
