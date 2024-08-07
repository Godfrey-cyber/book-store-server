import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createBook, getBook, getAllBooks, updateBook, deleteBook, booksByCategory, likePost } from '../controllers/books.js'
import { recommendProducts } from "../algorithms/recommendation-content.js"

const router = express.Router()

router.post("/create-book", protect, createBook)
router.get("/getBook/:id", getBook)
router.get("/getAllBooks", getAllBooks)
router.get("/books-by-category/:id", booksByCategory)
router.put("/update-book/:id", protect, updateBook)
router.delete("/delete-book/:id", protect, deleteBook)

// recommendation
router.get('/recommendations/:id', async (req, res) => {
  const { id } = req.params;
  const recommendations = await recommendProducts(id);
  res.json(recommendations);
});

export default router