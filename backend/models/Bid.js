const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const salt = await bcrypt.genSalt(10);

const BidSchema = new mongoose.Schema({
    
    gigId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Gig",
        required: [true, 'Gig reference is required'],
        index: true, 
    },
    freelancerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" },
        required: [true, 'Freelancer reference is required'],
    message: { 
        type: String ,
        minlength: [10, 'Message should be at least 10 characters'],
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
        required: [true, 'Bid message is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Bid price is required'],
        min: [1, 'Price must be at least 1'],
    },
    status: { 
        type: String, 
        enum: ['pending', 'hired', 'rejected'],
        default: "pending",
        required: true,
        index: true, 
    },
},
{
    timestamps: true,
}
);


BidSchema.virtual('id').get(function () {
  return this._id.toHexString();
});


BidSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

BidSchema.set('toObject', { virtuals: true });


BidSchema.index({ gigId: 1, status: 1 });

module.exports = mongoose.model('Bid', BidSchema);