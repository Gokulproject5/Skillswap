import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createExchange,
    getMyExchanges,
    tickChecklistItem,
    addChecklistItem,
    markComplete,
    reportUserFromExchange,
    getLeaderboard
} from '../controller/exchange.controller.js';

const router = express.Router();

router.post('/create', auth, createExchange);
router.get('/my', auth, getMyExchanges);
router.post('/tick', auth, tickChecklistItem);
router.post('/add-task', auth, addChecklistItem);
router.post('/complete', auth, markComplete);
router.post('/report', auth, reportUserFromExchange);
router.get('/leaderboard', auth, getLeaderboard);

export default router;
