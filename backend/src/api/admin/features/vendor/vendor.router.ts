import express from "express";

import { getAllVendor, getSingleVendor } from "./vendor.controller";

const router = express.Router();

router.get("/all", getAllVendor);
router.get("/:vendorId", getSingleVendor);

export default router;
