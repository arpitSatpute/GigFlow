import express from "express";

import {
    getGig,
    createGig,
    updateGig,
    getMyGigs,
    deleteGig,
    getGigs
} from "../controllers/gigController.js";
import { protect } from "../middleware/auth.js"

const router = express.Router();

router.get('/', getGigs) ;
router.post('/', protect, createGig);

router.get('/my-gigs', protect, getMyGigs);

router
  .route('/:id')
  .get(getGig)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;