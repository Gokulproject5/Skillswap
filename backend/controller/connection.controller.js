import ConnectionRequest from "../models/request.model.js";
import User from "../models/user.model.js";

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
        res.send('Request sent successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// my request 
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

        if (action === "accepted") {
            const requestDoc = await ConnectionRequest.findByIdAndUpdate(requestId, { status: 'accepted' });

            if (requestDoc) {

                await User.findByIdAndUpdate(requestDoc.sender, { $addToSet: { connection: requestDoc.receiver } });
                await User.findByIdAndUpdate(requestDoc.receiver, { $addToSet: { connection: requestDoc.sender } });
            }
        } else {
            await ConnectionRequest.findByIdAndUpdate(requestId, { status: "rejected" });
        }

        res.json({ message: "Updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
