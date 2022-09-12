import "./sidebar.css";
import {
  PlayCircleFilledOutlined,
  Bookmark,
  HelpOutline,
  
} from "@material-ui/icons";
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import SidebarEdit from "./SidebarEdit";
import { Button } from "@material-ui/core";

export default function Sidebar({ user }) {
  const [profileuser, setProfileuser] = useState(null);
  const { reload, user:currentuser, setAlert } = useContext(AuthContext);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followers, setFollowers] = useState(null);
  const [followings, setFollowings] = useState(null);
  const [followerButton, setFollowerButton] = useState("followModalButtonActive");
  const [followingButton, setFollowingButton] = useState("followModalButton");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${user._id}`);
      setProfileuser(res.data);
      console.log(res);
      setIsFollowed(user?.followers?.includes(currentuser._id));
    };
    fetchUser();
    
  }, [user,reload]);

  const handleFollow = async ()=>{
    try{
      await axios.put("/users/" + profileuser._id + "/follow", { userId: currentuser._id });
      setIsFollowed(true);
      setAlert({
        open: true,
        message: `You follow ${profileuser.username}!`,
        type: "success",
      }); 
    }catch(err){
        console.log(err);
        window.alert(err);
    }

  }
  const handleUnfollow = async ()=>{
     try{
       await axios.put(`/users/${profileuser._id}/unfollow`, { userId: currentuser._id });
       setIsFollowed(false);
       setAlert({
         open: true,
         message: `You Unfollowed ${profileuser.username}!`,
         type: "success",
       }); 
 
     }catch(err){
       console.log(err);
           window.alert(profileuser.username);
     }    
   }
  const fechFollowings = async () => {
    setFollowings(null);
    setOpen(true);
    if(followingButton === "followModalButton"){
      setFollowingButton("followModalButtonActive");
      setFollowerButton("followModalButton");
    }
    try{
      const res1 = await axios.get(`/users/followings/${user._id}`);
      setFollowings(res1.data);
      // window.alert("follow fetch");
    }catch(err){
      // window.alert(err);
    }
  };
 
  const fechFollowers = async () => {
    setFollowings(null);
    setOpen(true);
    if(followerButton === "followModalButton"){
      setFollowerButton("followModalButtonActive");
      setFollowingButton("followModalButton");
    }

    try{
      const res1 = await axios.get(`/users/followers/${user._id}`);
      setFollowings(res1.data);
      // window.alert("follow fetch");
    }catch(err){
      // window.alert(err);
    }
  };

  const handleClose = () => {
      setOpen(false);
  };


  return (<>
    <div className="sidebar">
      <div className="sidebarWrapper">
      <div className="profileCard">
          {profileuser?
          <>
            <figure class="snip1336">
                <div className="userNameNImg" >
                  <img class="cover" src={
                  profileuser?.coverPicture
                    ? PF + profileuser?.coverPicture :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkpEn2fpFhltVJPq0IGvnAPeDfA0_RlQG-9g&usqp=CAU"
                } alt="sample87" />
                  <img class="profile" src={
                  profileuser?.profilePicture
                    ? PF + profileuser?.profilePicture
                    : PF + "person/noAvatar.png"
                } alt="profile-sample4" />
                  <pre>{profileuser?.username} <VerifiedUserIcon style={{fontSize:"14px", color:"#54A5F5", }} /><span>{profileuser?.desc ? profileuser?.desc : "Guest User"}</span></pre>
                </div>
              <figcaption>
                <p><span>Bio</span>{profileuser?.bio ? profileuser?.bio : "I'm new here!"} </p>
                <div className="followersSection" >
                  <h1 onClick={fechFollowers} style={{cursor:"pointer"}} >{profileuser?.followers?.length}<h4 >Followers</h4></h1>
                  <h1 onClick={fechFollowings} style={{cursor:"pointer"}} >{profileuser?.followings?.length}<h4 >Following</h4></h1>
                </div>
              {profileuser?._id==currentuser._id?
                  <div className="Edit">
                    <SidebarEdit user={profileuser}/>
                  </div>
              : <div className="follow">
                  {isFollowed ? 
                  <div className="unfollowBtn" onClick={handleUnfollow} >Unfollow</div>:
                  <div className="followBtn" onClick={handleFollow} >Follow</div>
                }
                </div>
              
              }              </figcaption>

            </figure>
           </> 
           :
            <CircularProgress />
          }
      </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
          <div className="followModal">
            <div className="followModalTop">
              <div className={followerButton} onClick={fechFollowers}>Followers</div>
              <div className={followingButton} onClick={fechFollowings}>Followings</div>
            </div>
            {followings?
                  <>
                  {followings?.map((p) => (
                  <div className="followerCard">
                  <div className="followcardleft">
                    <div className="imgBorder">
                    <img src={
                          p.profilePicture
                            ? PF + p.profilePicture
                            : PF + "person/noAvatar.png"
                        } alt="" />
                    </div>
                    <div className="followcardUser">
                      <div className="followcardName">{p.username}</div>
                      <div className="followcardAbout">Designer</div>

                    </div>
                  </div>
                  <Link to={`/${p.username}`}>

                  <div className="followModalFollowBtn" >View</div>               
                  </Link>

                   </div>
                   ))}
                </>
              
            :
              <CircularProgress />
            }
            
          </div>
        </Dialog>
    </div>
    </> );
}
