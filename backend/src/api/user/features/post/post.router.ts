import express from "express";

import {
  postCreatePost,
  getAllPostsByUserId,
  getSinglePostById,
  postPostLike,
  deletePostLike,
  getAllReviewsByBusinessId,
} from "./post.controller";

const router = express.Router();

router.post("/create", postCreatePost);
router.get("/reviews/all/:businessId", getAllReviewsByBusinessId);
router.get("/all/:userId", getAllPostsByUserId);
router.get("/:postId", getSinglePostById);
router.post("/like/:postId", postPostLike);
router.delete("/like/:postId", deletePostLike);

export default router;
