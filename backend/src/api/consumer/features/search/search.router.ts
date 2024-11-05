import express from "express";

import {
  getSearchConsumers,
  getSearchBusinesses,
  getNearbyBusinesses,
  getSearchItems,
  getConsumerByUserId,
  getVendorByUserId,
  getSearchConsumersPosts,
  getSearchBusinessesPosts,
  getSearchItemsPosts,
} from "./search.controller";

const router = express.Router();

router.get("/consumers", getSearchConsumers);
router.get("/businesses", getSearchBusinesses);
router.get("/consumers/posts", getSearchConsumersPosts);
router.get("/businesses/posts", getSearchBusinessesPosts);
router.get("/consumers/:userId", getConsumerByUserId);
router.get("/vendors/:userId", getVendorByUserId);
router.get("/businesses/nearby", getNearbyBusinesses);
router.get("/items", getSearchItems);
router.get("/items/posts", getSearchItemsPosts);

export default router;
