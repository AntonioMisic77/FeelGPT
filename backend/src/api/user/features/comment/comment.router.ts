import express from "express";

import {
  deleteCommentLike,
  getAllCommentsByPostId,
  postCommentLike,
  postCreateComment,
} from "./comment.controller";

const router = express.Router();

router.post("/create", postCreateComment);
router.get("/all/:postId", getAllCommentsByPostId);
router.post("/like/:commentId", postCommentLike);
router.delete("/like/:commentId", deleteCommentLike);

export default router;
