import "./post.css";
import { MoreVert, Tune } from "@material-ui/icons";
import { useContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from '@material-ui/core';
import Comment from "../comments/Comment";
import FavoriteIcon from '@material-ui/icons/Favorite';
import SmsIcon from '@material-ui/icons/Sms';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function Post({ post, currentUser }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { setAlert, setReload, reload } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState('');
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(0);
  const heartImgPath =  "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e";
  const [show, setShow] = useState('like2');
  const [show2, setShow2] = useState('show2');

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
    setShow(post.likes.includes(currentUser._id) ? "like2blue" : "like2");
  }, [post,currentUser._id,reload]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post]);

  useEffect(() => {
    const fetchComments = async () => {
      try{
        const res =  await axios.get("posts/comment/"+ post._id);
        setComments(
          res.data.sort((p1, p2) => {       
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
    }catch(err){
      
      console.log(err);
    }
  };
  fetchComments();
  }, [ refresh ]);
  
  useEffect(() => {
  }, [])
  
  const postComment = (event) => {
    event.preventDefault();
    const newComment = {
      userId: currentUser._id,
      postId: post._id,
      text:comment,
    };
    try {
      axios.post("/posts/comment",newComment);
      console.log("posted" + newComment);
      // axios.put("/posts/" + post._id + "/comment", { userId: currentUser._id });
    } catch (err) {
      console.log(err);
    }
   setComment("");
   setShow2("show2");
   setRefresh(Math.random());
}
  
const deletePost = (event) => {
  event.preventDefault();
  if(post.userId === currentUser._id){
    try {
      axios.put("/posts/" + post._id + "/delete",{ userId:currentUser._id });
      console.log( post._id );
      console.log(currentUser._id );
      setAlert({
        open: true,
        message: "Post deleted successfully!",
        type: "success",
      }); 
      setReload(Math.random());
  
    } catch (err) {
      console.log("this is the error "+err);
      setAlert({
        open: true,
        message: err,
        type: "error",
      }); 
    }
  }else{
    setAlert({
      open: true,
      message: "You can delete your posts only!",
      type: "error",
    }); 
  }
  

  
}
  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setShow(isLiked ? "like2" : "like2blue")
    setIsLiked(!isLiked);
   
  };
  const showcomments = () =>{
    if(show2  == null){
      setShow2("show2");
    }else{
      setShow2(null);
    }
  }
  return (<>

    <div className="post">
      <div className="postWrapper">
        {
          user ? <>
          <div className="postTop">
            <div className="postTopLeft">
              <Link to={`/${user.username}`}>
                <div className="postProfileImg">
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                </div>
              </Link>
              <div className="postUsername">{user.username}<VerifiedUserIcon  style={{fontSize:"14px", color:"#54A5F5", marginLeft:"5px"}}/></div>
            </div>
            <div className="postTopRight">
            <span className="postDate">{format(post.createdAt)}</span>
              <MoreVert onClick={deletePost} />
            </div>
          </div>
          <div className="postCenter">
            <img className="postImg" src={PF + post.img} alt="" />
            <div className="postText">{post?.desc}</div>
          </div>

          <div className="postcomment">
              <form onSubmit={postComment}>
                  <div className="commentBox">
                    <div className="commentBoxLeft">
                      <div className="post__avatar2Border">
                      <img
                      className="post__avatar2"
                      src={
                        currentUser.profilePicture
                        ? PF + currentUser.profilePicture
                        : PF + "person/noAvatar.png"
                      }
                      alt=""
                      
                      />
                      </div>
                      <input className="commentInputBox" type="text" placeholder="Write a comment!"  onChange={(e)=>{setComment(e.target.value)}} value={comment} />
                      <input type="submit" disabled={!comment} className="transparent__submit" />
                    </div>  
                    <div className="commentsInputOptions">
                        <FavoriteIcon onClick={likeHandler} className={show} />
                        <div className="postLikeCounter">{like}</div>
                        <SmsIcon  className='like2' onClick={showcomments} />
                        <div className="postLikeCounter">{comments.length}</div>
                    </div>
                  </div>
              </form>
              <div className={show2 ? "commentslist": "commentslistHide"} >        
              {
                  comments ? <>
                    {comments?.map((comment) => (
                        <Comment key={comment._id} comment={comment} post={post} />
                  ))}
                  </> :<></>
              }
              </div>
          </div>
          </> :
          <div className="loaddingDiv">
            <CircularProgress />
          </div>
        }
        
      </div>
    </div>
     </>
  );
}
