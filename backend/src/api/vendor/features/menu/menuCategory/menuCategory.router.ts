import express from "express";

import {
  postCreateMenuCategory,
  getAllMenuCategories,
} from "./menuCategory.controller";

const router = express.Router();

router.post("/create", postCreateMenuCategory);
router.get("/all/:vendorId", getAllMenuCategories);

export default router;
