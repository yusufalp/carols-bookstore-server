const express = require("express");

const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookControllers");

// all router methods in this file start with '/api/books'
const router = express.Router();

router.get("/", getAllBooks);

router.get("/:id", getBook);

router.post("/create", createBook);

router.put("/update/:id", updateBook);

router.delete("/delete/:id", deleteBook);

module.exports = router;
