import React from 'react';
import { format } from "timeago.js";
import { useContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';


const Comment = ({comment, post}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchCommentUser = async () => {
          const res = await axios.get(`/users/${comment.userId}`);
          setUser(res.data);
        };
        console.log(user);
        fetchCommentUser();
      }, [comment]);

  return (
                    <div className={`comments__show`}>
                                <div className={`comment_userProfile  ${comment.userId == post?.userId && 'myself'}`}>
                                <div className="post__avatar2Border">
                                <img
                                  className="post__avatar2"
                                  src={
                                    user.profilePicture
                                      ? PF + user.profilePicture
                                      : PF + "person/noAvatar.png"
                                  }
                                  alt=""
                                />
                                </div>
                                </div>
                          <div class="container__comments">
                            <div className="container__commentsTop">
                                <div className="container__commentsTop_left">
                                  <div className="container__commentUsername">{user?.username} <VerifiedUserIcon style={{fontSize:"14px", color:"#54A5F5", }} /></div>
                                  <i class="post__verified"></i>
                                </div>
                                <div className="postDate">{format(comment.createdAt)}</div>
                            </div>
                            <div className="comment__text">{comment?.text}</div>
                          </div>
                    </div>  )
}

export default Comment