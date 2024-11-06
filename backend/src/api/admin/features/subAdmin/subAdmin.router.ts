import express from "express";

import { getAllSubAdmins, getSingleSubAdmin } from "./subAdmin.controller";

const router = express.Router();

router.get("/all", getAllSubAdmins);
router.get("/:subAdminId", getSingleSubAdmin);

export default router;
