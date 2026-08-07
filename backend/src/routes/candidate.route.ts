import { Router } from "express";
import { addCandidate, getCandidates } from "../controllers/candidate.controller";
const router = Router();

router.route('/add').post(addCandidate);
router.route('/').get(getCandidates);

export default router;