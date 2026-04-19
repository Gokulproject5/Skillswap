import { model, Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: String
    }
}, { timestamps: true });

const Message = model('Message', messageSchema, "messages");

export default Message;
