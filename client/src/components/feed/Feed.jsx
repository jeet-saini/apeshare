import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user, reload } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get(`/users/${user._id}`);
      setCurrentUser(res.data);
      }catch(err){
        console.log(err);
      }
    };
    fetchUser();
    console.log(currentUser);
  }, [reload]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("posts/allposts/");
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
      console.log(res.data);
    };
    fetchPosts();
  }, [username, user._id, reload]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
