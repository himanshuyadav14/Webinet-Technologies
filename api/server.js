const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

// app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(
  "mongodb+srv://himyadavyh:Hy8tYDdlVRH4wrot@cluster0.btllf69.mongodb.net/?retryWrites=true&w=majority"
);

cloudinary.config({
  cloud_name: "dacjab22h",
  api_key: "212133697556878",
  api_secret: "pV71A3TVuRLQ62or-HJR0QN6I98",
});

// Set up multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Codehelp", // Specify the folder in Cloudinary
    format: async (req, file) => "png", // Format of the image (you can change this)
  },
});

const uploadMiddleware = multer({ storage: storage });

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      const { title, summary, content } = req.body;

      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
        
      const postDoc = await Post.create({
        title: title,
        summary: summary,
        content: content,
        cover: cloudinaryResult.secure_url || cloudinaryResult.url,
        author: info.id,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error("Error uploading post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
    try {
      const { token } = req.cookies;
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
  
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor =
          JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(400).json("You are not the author");
        }
  
        let coverUrl = postDoc.cover;
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          coverUrl = result.secure_url;
        }
  
        // Use updateOne to update the document
        await Post.updateOne({ _id: id }, {
          title,
          summary,
          content,
          cover: coverUrl,
        });
  
        // Fetch the updated document
        const updatedPost = await Post.findById(id);
  
        res.json(updatedPost);
      });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete('/post/:id', async (req, res) => {
    const postId = req.params.id;
  
    try {
      // Find the post by ID and delete it
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        // If the post with the given ID is not found
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Respond with a success message or any other necessary data
      res.json({ message: 'Post deleted successfully', deletedPost });
    } catch (error) {
      // Handle errors, e.g., database errors
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(4000);
//
