import mongoose, { model, Schema } from "mongoose";

const checklistItemSchema = new Schema({
   label: { type: String, required: true },
   assignedTo: { type: String, enum: ['userA', 'userB', 'shared'], default: 'shared' },
   completedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
   completedAt: { type: Date, default: null },
}, { _id: true });

const exchangeSchema = new Schema({
   request: {
      type: Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
      unique: true
   },
   userA: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   userB: { type: Schema.Types.ObjectId, ref: 'User', required: true },


   skillsAtoB: [{ type: String }],
   skillsBtoA: [{ type: String }],


   progressA: { type: Number, default: 0, min: 0, max: 100 },
   progressB: { type: Number, default: 0, min: 0, max: 100 },

   checklist: [checklistItemSchema],

   status: {
      type: String,
      enum: ['active', 'completed', 'disputed', 'cancelled'],
      default: 'active'
   },


   completedByA: { type: Boolean, default: false },
   completedByB: { type: Boolean, default: false },


   ratingByA: { type: Number, min: 1, max: 5, default: null },
   reviewByA: { type: String, default: '' },
   ratingByB: { type: Number, min: 1, max: 5, default: null },
   reviewByB: { type: String, default: '' },

   reportedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   reportReason: { type: String, default: '' },

   pointsAwarded: { type: Boolean, default: false },

}, { timestamps: true });

const Exchange = model('Exchange', exchangeSchema, 'exchanges');
export default Exchange;
