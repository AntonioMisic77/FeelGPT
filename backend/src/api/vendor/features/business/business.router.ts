import express from "express";

import { getRatingInfo, getAllBusinesses } from "./business.controller";

const router = express.Router();

router.get("/:businessId/rating-info", getRatingInfo);
router.get("/all", getAllBusinesses);

export default router;
