import Exchange from "../models/exchange.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/request.model.js";
import { sendNotification } from "../service/Socket.js";


const POINTS = {
    EXCHANGE_COMPLETE: 50,
    CHECKLIST_ITEM: 5,
    REPORT_PENALTY: -20,
    BADGE_THRESHOLDS: { bronze: 50, silver: 150, gold: 400, platinum: 1000 }
};

const updateBadge = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return;
    const pts = Math.max(0, user.loyaltyPoints);
    let badge = 'none';
    if (pts >= POINTS.BADGE_THRESHOLDS.platinum) badge = 'platinum';
    else if (pts >= POINTS.BADGE_THRESHOLDS.gold) badge = 'gold';
    else if (pts >= POINTS.BADGE_THRESHOLDS.silver) badge = 'silver';
    else if (pts >= POINTS.BADGE_THRESHOLDS.bronze) badge = 'bronze';
    await User.findByIdAndUpdate(userId, { badge });
};


const recalcProgress = (exchange) => {
    const total = exchange.checklist.length;
    const done = exchange.checklist.filter(i => i.completedBy).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    exchange.progressA = pct;
    exchange.progressB = pct;
};


export const createExchange = async (req, res) => {
    try {
        const { requestId, skillsAtoB, skillsBtoA, checklistItems } = req.body;

        const request = await ConnectionRequest.findById(requestId);
        if (!request || request.status !== 'accepted') {
            return res.status(400).json({ message: "Request not found or not accepted" });
        }

        const existing = await Exchange.findOne({ request: requestId });
        if (existing) return res.status(400).json({ message: "Exchange already exists" });

        const sA = skillsAtoB || [];
        const sB = skillsBtoA || [];

        const checklist = checklistItems?.length
            ? checklistItems.map(label => ({ label, assignedTo: 'shared' }))
            : [
                ...sA.map(s => ({ label: `Teach "${s}" — session done`, assignedTo: 'userA' })),
                ...sB.map(s => ({ label: `Teach "${s}" — session done`, assignedTo: 'userB' })),
                { label: 'Final review & feedback shared', assignedTo: 'shared' },
            ];

        const exchange = await Exchange.create({
            request: requestId,
            userA: request.sender,
            userB: request.receiver,
            skillsAtoB: sA,
            skillsBtoA: sB,
            checklist
        });

        res.status(201).json(exchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getMyExchanges = async (req, res) => {
    try {
        const userId = req.user.id;
        const exchanges = await Exchange.find({
            $or: [{ userA: userId }, { userB: userId }]
        })
            .populate('userA', 'name profile_pic slug loyaltyPoints badge exchangesCompleted')
            .populate('userB', 'name profile_pic slug loyaltyPoints badge exchangesCompleted')
            .populate('request', 'skillsOffered skillsRequested message')
            .sort({ updatedAt: -1 });

        res.json(exchanges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const tickChecklistItem = async (req, res) => {
    try {
        const { exchangeId, itemId } = req.body;
        const userId = req.user.id;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) return res.status(404).json({ message: "Exchange not found" });
        if (exchange.status !== 'active') return res.status(400).json({ message: "Exchange is not active" });

        const item = exchange.checklist.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        const isA = exchange.userA.toString() === userId;
        const isB = exchange.userB.toString() === userId;


        if (item.assignedTo === 'userA' && !isA) {
            return res.status(403).json({ message: "This task belongs to your partner" });
        }
        if (item.assignedTo === 'userB' && !isB) {
            return res.status(403).json({ message: "This task belongs to your partner" });
        }

        const wasCompleted = !!item.completedBy;

        if (wasCompleted) {

            if (item.completedBy.toString() !== userId) {
                return res.status(403).json({ message: "Only the person who completed this can undo it" });
            }
            item.completedBy = null;
            item.completedAt = null;
            await User.findByIdAndUpdate(userId, {
                $inc: { loyaltyPoints: -POINTS.CHECKLIST_ITEM }
            });
        } else {
            item.completedBy = userId;
            item.completedAt = new Date();
            await User.findByIdAndUpdate(userId, {
                $inc: { loyaltyPoints: POINTS.CHECKLIST_ITEM }
            });
            await updateBadge(userId);
        }

        recalcProgress(exchange);
        await exchange.save();

        res.json({ exchange, pointsChanged: wasCompleted ? -POINTS.CHECKLIST_ITEM : POINTS.CHECKLIST_ITEM });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addChecklistItem = async (req, res) => {
    try {
        const { exchangeId, label } = req.body;
        const userId = req.user.id;

        if (!label?.trim()) return res.status(400).json({ message: "Label is required" });

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) return res.status(404).json({ message: "Not found" });
        if (exchange.status !== 'active') return res.status(400).json({ message: "Exchange is not active" });

        const isA = exchange.userA.toString() === userId;
        const isB = exchange.userB.toString() === userId;
        if (!isA && !isB) return res.status(403).json({ message: "Not part of this exchange" });

        exchange.checklist.push({
            label: label.trim(),
            assignedTo: 'shared',
        });

        recalcProgress(exchange);
        await exchange.save();
        res.json(exchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const markComplete = async (req, res) => {
    try {
        const { exchangeId, rating, review } = req.body;
        const userId = req.user.id;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) return res.status(404).json({ message: "Not found" });
        if (exchange.status !== 'active') return res.status(400).json({ message: "Exchange already finalized" });

        const isA = exchange.userA.toString() === userId;
        const isB = exchange.userB.toString() === userId;
        if (!isA && !isB) return res.status(403).json({ message: "Not part of this exchange" });

       
        const total = exchange.checklist.length;
        const done = exchange.checklist.filter(i => i.completedBy).length;
        if (total > 0 && done < Math.ceil(total / 2)) {
            return res.status(400).json({
                message: `Complete at least ${Math.ceil(total / 2)} of ${total} checklist tasks first`
            });
        }

       
        if (rating) {
            if (isA) {
                exchange.ratingByA = Math.min(5, Math.max(1, parseInt(rating)));
                exchange.reviewByA = review || '';
            } else {
                exchange.ratingByB = Math.min(5, Math.max(1, parseInt(rating)));
                exchange.reviewByB = review || '';
            }
        }

        if (isA) exchange.completedByA = true;
        if (isB) exchange.completedByB = true;

       
        if (exchange.completedByA && exchange.completedByB && !exchange.pointsAwarded) {
            exchange.status = 'completed';
            exchange.pointsAwarded = true;

            await User.findByIdAndUpdate(exchange.userA, {
                $inc: { loyaltyPoints: POINTS.EXCHANGE_COMPLETE, exchangesCompleted: 1 }
            });
            await User.findByIdAndUpdate(exchange.userB, {
                $inc: { loyaltyPoints: POINTS.EXCHANGE_COMPLETE, exchangesCompleted: 1 }
            });
            await updateBadge(exchange.userA.toString());
            await updateBadge(exchange.userB.toString());

            sendNotification(exchange.userA.toString(), 'notification', {
                title: '🎉 Exchange Complete!',
                message: `You earned ${POINTS.EXCHANGE_COMPLETE} loyalty points!`,
                type: 'accept'
            });
            sendNotification(exchange.userB.toString(), 'notification', {
                title: '🎉 Exchange Complete!',
                message: `You earned ${POINTS.EXCHANGE_COMPLETE} loyalty points!`,
                type: 'accept'
            });
        }

        await exchange.save();
        res.json(exchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const reportUserFromExchange = async (req, res) => {
    try {
        const { exchangeId, reason } = req.body;
        const reporterId = req.user.id;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) return res.status(404).json({ message: "Not found" });

        if (exchange.reportedBy.map(r => r.toString()).includes(reporterId)) {
            return res.status(400).json({ message: "Already reported" });
        }

        exchange.reportedBy.push(reporterId);
        exchange.reportReason = reason || '';
        exchange.status = 'disputed';
        await exchange.save();

        const reportedUserId = exchange.userA.toString() === reporterId
            ? exchange.userB
            : exchange.userA;

        const reportedUser = await User.findByIdAndUpdate(
            reportedUserId,
            {
                $inc: { reportCount: 1, loyaltyPoints: POINTS.REPORT_PENALTY },
                $addToSet: { reportedBy: reporterId }
            },
            { new: true }
        );

        if (reportedUser.reportCount >= 5 && !reportedUser.isBanned) {
            await User.findByIdAndUpdate(reportedUserId, { isBanned: true });
            sendNotification(reportedUserId.toString(), 'notification', {
                title: '⚠️ Account Restricted',
                message: 'Your account has been restricted due to multiple reports.',
                type: 'reject'
            });
        }

        await updateBadge(reportedUserId.toString());
        res.json({ message: "Report submitted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ isBanned: false })
            .select('name profile_pic slug loyaltyPoints badge exchangesCompleted')
            .sort({ loyaltyPoints: -1 })
            .limit(10);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
