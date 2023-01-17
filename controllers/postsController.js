import PostModel from "../models/PostModel.js"
import jsonwebtoken from "jsonwebtoken"
import bcrpty from "bcrypt"

export const createPost = async function (req, res) {
  try {
    const newPost = new PostModel({
      title: req.body.title,
      text: req.body.text,
      user: req.userId,
    })
    const post = await newPost.save()
    res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "create post error",
    })
  }
}

export const getPosts = async function (req, res) {
  try {
    const posts = await PostModel.find().populate("user").exec()
    res.json(posts)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "error get all posts",
    })
  }
}

export const getOnePost = async function (req, res) {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      function (err, post) {
        if (err) {
          return res.status(500).json({
            message: "error get post",
          })
        }
        if (!post) {
          return res.status(404).json({
            message: "post not found",
          })
        }
        res.json(post)
      }
    )
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "error get one posts",
    })
  }
}

export const deletePost = async function (req, res) {
  try {
    const postId = req.params.id

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      function (err, post) {
        if (err) {
          return res.status(500).json({
            message: "error delete post",
          })
        }
        if (!post) {
          return res.status(404).json({
            message: "post not found",
          })
        }
        res.json({
          success: true,
        })
      }
    )
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "error delete post",
    })
  }
}

export const updatePost = async function (req, res) {
  try {
    const postId = req.params.id
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
      }
    )

    res.json({
      success: true,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "error update post",
    })
  }
}