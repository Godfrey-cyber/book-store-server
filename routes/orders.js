const express = require('express');
const router = express.Router();
import { createOrder } from "../controllers/orders.js"
import { verifyAdmin, protect } from "../middleware/authMiddleware.js";

router.post('/create-order', protect, createOrder);
export default router