import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'hired', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;