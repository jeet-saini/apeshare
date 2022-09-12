import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { useContext, useState,useEffect  } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";


export default function SidebarEdit({ user }) {
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = useState(null);
  const [cover, setCover] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [title, setTitle] = useState(user.desc);
  const [bio, setBio] = useState(user.bio);
  const { setAlert, setReload } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCover(null);
        setProfile(null);
        setUsername(user.username);
        setTitle(user.desc);
        setBio(user.bio)
    };

  const submitHandler = async (e) => {
    setOpen(false);

      e.preventDefault();
      const newProfile = {
        username: username, desc: title, bio: bio, 
      };
      if (profile == null && cover == null 
        && title == user.desc && username ==user.username && bio ==user.bio
        ) {
          setAlert({
            open: true,
            message: "No changes applied to profile!",
            type: "info",
          }); 
        console.log("No chnages Applied to Profile!")
    } 
    else{
      
      if (profile ) {
        const data1 = new FormData();
        const fileName = Date.now() + profile.name;
        data1.append("name", fileName);
        data1.append("file", profile);
        newProfile.profilePicture = fileName;
        console.log(fileName);
        try {
          await axios.post("/upload", data1);
          window.alert("profile uploaded!") 
        } catch (err) {
          window.alert(err) 
  
        }
      } 
      if (cover) {
        const data2 = new FormData();
        const fileName = Date.now() + cover.name;
        data2.append("name", fileName);
        data2.append("file", cover);
        newProfile.coverPicture = fileName;
        console.log(fileName);
        try {
          await axios.post("/upload", data2);
          window.alert("cover "+fileName+" uploaded!"); 
        } catch (err) {}
      } 
      try {
        await axios.post("/users/"+ user._id, newProfile);
        console.log("posted" + newProfile)
        setAlert({
          open: true,
          message: "Profile Updated Successfully.",
          type: "success",
        });       
      } catch (err) {}
      setProfile(null);
      setCover(null);
      setReload(Math.random());

    }

    };
  

  return (
    <div>
      <Button variant="outlined" color="disabled" fontSize="small" onClick={handleClickOpen} 
            style={{width:"100%", fontSize:"medium"}}
      >
        EDIT PROFILE <EditTwoToneIcon style={{marginLeft:"20px"}} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="profileCard">
          <figure class="snip1336">
        <DialogTitle id="alert-dialog-title">{"Update Profile"}</DialogTitle>
                <div className="userNameNImg" >
                  <img className="cover" src={
                  cover
                  ? URL.createObjectURL(cover)
                  : PF + user.coverPicture
                  } alt="sample87" />
                    <div className="coverEditIcon"> 
                      <label htmlFor="cover">
                      <EditTwoToneIcon className='EditIcon' />                      
                      </label>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="cover"
                        accept=".png,.jpeg,.jpg,.jfif"
                        onChange={(e) => setCover(e.target.files[0])}
                      />
                    </div>
                  <img class="profile" 
                  src={
                  profile
                  ? URL.createObjectURL(profile)
                  : PF + user.profilePicture
                  } alt="profile-sample4" />
                    <div className="profileEditIcon">
                      <label htmlFor="profile">
                      <EditTwoToneIcon className='EditIcon' />                      
                      </label>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="profile"
                        accept=".png,.jpeg,.jpg,.jfif"
                        onChange={(e) => setProfile(e.target.files[0])}
                      />
                    </div>
                  <pre>
                        <input className='username' alt='click to change'
                        type='text' placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}   />
                    <span>
                        <input className='title'
                        type='text' placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}   />
                    </span>
                  </pre>
                </div>
              <figcaption>
                <p><span>Bio</span>
                <input className='bio'
                        type='text' placeholder="Write something about you here!" value={bio} onChange={(e) => setBio(e.target.value)}   /></p>

                <hr />

              </figcaption>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={submitHandler} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
            </figure>
      </div>
      </Dialog>
    </div>
  );
}
