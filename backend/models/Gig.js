const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);


const GigSchema = new mongoose.Schema({

    title: { 
        type: String, 
        required: [true, 'Gig title is required'],
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'],
        minlength: [20, 'Description must be at least 20 characters'],
    },
    budget: { 
        type: Number, 
        required: true,
        min: [1, 'Budget must be at least 1'],
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Gig owner is required'],
    },
    status: { 
        type: String, 
        enum: ['open', 'assigned'], 
        default: 'open',
        index: true,
    },

},
{
    timestamps: true, 
  }
);


GigSchema.virtual('id').get(function () {
  return this._id.toHexString();
});


GigSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

GigSchema.set('toObject', { virtuals: true });

//  for search on title, description
GigSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Gig', GigSchema);