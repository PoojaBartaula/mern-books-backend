require("dotenv").config(); // to use .env...secure garxa
const express = require("express");
const connectToDatabase = require("./database");
// const Book = require('./model/bookModel');
const fs = require("fs");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Book = require("./model/bookModel");
const { multer, storage } = require("./middleware/multerconfig");
const upload = multer({ storage: storage }); //multer confiuration for file uploads.
const cors = require("cors");

app.use(express.json()); //express le json handle garna sakdaina....so this function is for it to use json and understand

connectToDatabase();
const BASE_URL = "https://mern-books-backend-71em.onrender.com";

//app.get("/path",(request,respond))
app.use(cors({ origin: ["*", "https://mern-books-theta.vercel.app"] }));
app.get("/", (req, res) => {
  //abc= request, add= respond
  res.send("Hello World");
});
app.post("/book", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  let fileName = req.file
    ? `${BASE_URL}/${req.file.filename}`
    : "https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg";
  try {
    const {
      bookName,
      bookPrice,
      isbnNumber,
      authorName,
      publishedAt,
      publication,
      description,
    } = req.body;
    const imageName = fileName;

    const book = await Book.create({
      bookName,
      bookPrice,
      isbnNumber,
      authorName,
      publishedAt,
      publication,
      description,
      imageUrl: imageName,
    });
    res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Book creation failed",
      error: error.message,
    });
  }
});
// all read
app.get("/book", async (req, res) => {
  const books = await Book.find(); // return array ma garxa
  res.status(200).json({
    message: "Books fetched successfully",
    data: books,
  });
});

// single read
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id); // return object garxa

  if (!book) {
    res.status(404).json({
      message: "Nothing found",
    });
  } else {
    res.status(200).json({
      message: "Single Book Fetched Successfully",
      data: book,
    });
  }
});
// delete operation
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Delete image file only if it's stored locally (not external link)
    if (book.imageUrl && book.imageUrl.startsWith(BASE_URL)) {
      const imagePath = book.imageUrl.slice(BASE_URL.length + 1);
      fs.unlink(`storage/${imagePath}`, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("Image file deleted successfully");
      });
    }
    // Delete book from DB
    await Book.findByIdAndDelete(id);

    res.status(200).json({
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
// update operation
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // kun book update garney id ho yo
  const {
    bookName,
    bookPrice,
    authorName,
    publishedAt,
    publication,
    isbnNumber,
  } = req.body;
  const oldDatas = await Book.findById(id);
  if (!oldDatas) {
    return res.status(404).json({ message: "Book not found" });
  }

  let fileName = oldDatas.imageUrl;

  if (req.file) {
    // delete old file if it was not a placeholder image
    if (oldDatas.imageUrl && oldDatas.imageUrl.startsWith(BASE_URL)) {
      const oldImagePath = oldDatas.imageUrl.slice(BASE_URL.length + 1);
      fs.unlink(`storage/${oldImagePath}`, (err) => {
        if (err) console.log("Error deleting old file:", err);
        else console.log("Old file deleted successfully");
      });
    }

    // save new file path
    fileName = `${BASE_URL}/${req.file.filename}`;
  }

  await Book.findByIdAndUpdate(id, {
    bookName,
    bookPrice,
    authorName,
    publication,
    publishedAt,
    isbnNumber,
    imageUrl: fileName, //  update image URL if changed
  });

  res.status(200).json({
    message: "Book Updated Successfully",
  });
});
app.use(express.static("./storage/"));

app.listen(process.env.PORT, () => {
  //yo last ma rakhni......process.env.PORT(write this in 3000)
  console.log("Nodejs is running on port 3000");
});
