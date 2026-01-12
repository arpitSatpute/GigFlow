const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required:[true,"Password is required"],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
},
{
    timestamps: true,
}
);


UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;          
    return ret;
  },
});

UserSchema.set('toObject', { virtuals: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



module.export = mongoose.model('User', UserSchema);