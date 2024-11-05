import express from "express";

import {
  postCreateDeal,
  getAllDeals,
  getSingleDeal,
  deleteDeal,
} from "./deals.controller";

const router = express.Router();

router.post("/create", postCreateDeal);
router.get("/all/:vendorId", getAllDeals);
router.get("/:dealId", getSingleDeal);
router.delete("/delete/:dealId", deleteDeal);

export default router;
