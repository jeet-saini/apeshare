import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import "./home.css"
import { Navbar } from "../../components/navbar/Navbar";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <>
    <div className="home">
      <Navbar />
      <div className="main">
        <div className="mainLeft">
        <Sidebar user={user} />

        </div>
        <div className="feed">
        <Feed/>

        </div>
      </div>
    </div>
    </>
  );
}
