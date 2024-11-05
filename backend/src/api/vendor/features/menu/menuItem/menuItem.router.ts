import express from "express";

import {
  postCreateMenuItem,
  deleteMenuItem,
  putMenuItem,
  getSingleMenuItem,
  getAllMenuItemsForBusiness,
} from "./menuItem.controller";

const router = express.Router();

router.post("/create", postCreateMenuItem);
router.delete("/delete/:menuItemId", deleteMenuItem);
router.put("/update/:menuItemId", putMenuItem);
router.get("/all/:businessId", getAllMenuItemsForBusiness);
router.get("/:menuItemId", getSingleMenuItem);

export default router;
