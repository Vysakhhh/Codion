import express from 'express';
import { getReviewController } from '../controllers/ai.controllers.js'; 

const router = express.Router();

router.post('/get-review', getReviewController);

export default router;

