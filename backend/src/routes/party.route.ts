import { Router } from "express";
import { addParty, getParties } from "../controllers/party.controller";

const router = Router();

router.route('/add').post(addParty);
router.route('/').get(getParties);

export default router;
