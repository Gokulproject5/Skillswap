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
   }
})

const ConnectionRequest = model('Request', requestSchema, "requests");

export default ConnectionRequest;