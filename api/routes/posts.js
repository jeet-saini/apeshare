const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");


//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//post a comment

router.post("/comment", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment= await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.put("/:id/comment", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//       await post.updateOne({ $push: { comments: req.body.userId } });
//       res.status(200).json("you commented successfully!");

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post

router.put("/:id/delete", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const postUser=post.userId;
    const currentUser = req.body.userId;
    
    if (postUser === currentUser) {
      
      await post.deleteOne();
      res.status(200).json("the post has been deleted" );
    } else {
      res.status(403).json("you  can delete only your post not ");
    }

  } catch (err) {
    res.status(500).json(err);
    res.send(err);

  }
});


//get all post

router.get("/allposts", async (req, res) => {
  try {
    const currentUser = await User.findById();
    const userPosts = await Post.find({ type: "post" });
    
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get comment

router.get("/comment/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.find({ postId: post._id });
    res.status(200).json(comment);
    // res.send(req.params.id);
  } catch (err) {
    res.send(err);
    res.status(500).json(err);
  }
});

module.exports = router;
