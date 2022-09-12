import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user, reload, setReload, setAlert } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${user._id}`);
      setCurrentUser(res.data);
      console.log(res);
    };
    fetchUser();
  }, [reload]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (desc == "" && file == null) {
      setAlert({
        open:true,
        type :"success",
        message:"Please write something before post",

      });
      console.log("Please write something before post");
  } else{
    const newPost = {
      userId: user._id,
      desc: desc,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost);
      // window.location.reload();
      console.log("posted" + newPost)
    } catch (err) {}
    setFile(null);
    setDesc("");
    setReload(Math.random());
  }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUser?.profilePicture
                ? PF + currentUser?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + currentUser.username + "?"}
            className="shareInput"
            value={desc}
            onChange={(e)=>{setDesc(e.target.value)}}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="#8b0d0d" className="shareIcon" />
              <span className="shareOptionText">Upload a Picture!</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button className="shareButton" type="submit">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
