import { model, Schema } from "mongoose";

const requestSchema = new Schema({
   sender: {
      type: Schema.Types.ObjectId, ref: "User"
   },
   receiver: {
      type: Schema.Types.ObjectId, ref: "User"
   },
   status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
   },
   // Skills the sender will teach to receiver
   skillsOffered: [{ type: String }],
   // Skills the sender wants to learn from receiver  
   skillsRequested: [{ type: String }],
   // Exchange note/message
   message: { type: String, default: '' }
}, { timestamps: true });

const ConnectionRequest = model('Request', requestSchema, "requests");

export default ConnectionRequest;