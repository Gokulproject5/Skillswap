import ConnectionRequest from "../models/request.model.js";
import User from "../models/user.model.js";
import Exchange from "../models/exchange.model.js";
import { sendNotification } from "../service/Socket.js";

// requset new user
export const Request = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        // check if request already exists
        const existingConnection = await ConnectionRequest.findOne({
            sender: senderId,
            receiver: receiverId
        });

        if (existingConnection) {
            return res.status(400).send("Request already sent");
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            receiver: receiverId
        });

        await newRequest.save();
        
        sendNotification(receiverId, "notification", {
            title: "New Skill Swap Request",
            message: "Someone wants to swap skills with you!",
            type: "request"
        });
        
        res.send('Request sent successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// my sent requests (outgoing)
export const mySentRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        const list = await ConnectionRequest.find({
            sender: userId,
            status: 'pending',
        }).populate('receiver', 'name skills profile_pic seeking slug');

        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// my incoming requests
export const myRequest = async (req, res) => {
    try {
        const { userId } = req.params;

        const list = await ConnectionRequest.find({
            receiver: userId,
            status: 'pending',
        }).populate('sender', 'name skills profile_pic seeking slug');

        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const handleRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body;

        const requestDoc = await ConnectionRequest.findById(requestId);
        if (!requestDoc) return res.status(404).json({ message: "Not found" });

        if (action === "accepted") {
            requestDoc.status = 'accepted';
            await requestDoc.save();

            const [senderUser, receiverUser] = await Promise.all([
                User.findByIdAndUpdate(requestDoc.sender, { $addToSet: { connection: requestDoc.receiver } }, { new: true }),
                User.findByIdAndUpdate(requestDoc.receiver, { $addToSet: { connection: requestDoc.sender } }, { new: true }),
            ]);

            // Auto-create exchange session using skills from both profiles
            const skillsAtoB = requestDoc.skillsOffered?.length
                ? requestDoc.skillsOffered
                : senderUser?.skills?.slice(0, 2) || [];
            const skillsBtoA = requestDoc.skillsRequested?.length
                ? requestDoc.skillsRequested
                : receiverUser?.skills?.slice(0, 2) || [];

            const existingExchange = await Exchange.findOne({ request: requestDoc._id });
            if (!existingExchange) {
                await Exchange.create({
                    request: requestDoc._id,
                    userA: requestDoc.sender,
                    userB: requestDoc.receiver,
                    skillsAtoB,
                    skillsBtoA,
                    checklist: [], // starts empty — both users add their own tasks
                });
            }

            sendNotification(requestDoc.sender.toString(), "notification", {
                title: "Request Accepted 🎉",
                message: "Your skill swap request was accepted! Go to Exchanges to get started.",
                type: "accept"
            });
        } else {
            requestDoc.status = 'rejected';
            await requestDoc.save();

            sendNotification(requestDoc.sender.toString(), "notification", {
                title: "Request Declined",
                message: "Your skill swap request was declined.",
                type: "reject"
            });
        }

        res.json({ message: "Updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
