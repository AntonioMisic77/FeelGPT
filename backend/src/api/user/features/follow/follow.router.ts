import express from "express";

import {
  postUserFollow,
  deleteUserFollow,
  getUserFollowers,
  getUserFollowings,
} from "./follow.controller";

const router = express.Router();

router.post("/:userId", postUserFollow);
router.delete("/:userId", deleteUserFollow);
router.get("/followers/:userId", getUserFollowers);
router.get("/followings/:userId", getUserFollowings);

export default router;
