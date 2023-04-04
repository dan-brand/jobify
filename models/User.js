import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Pleease provide a valid email'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'my lastname'
    },
    location: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'my city'
    }
})

// Pre middleware for saving hashed password - note, John mentiond that this middleware does not run before every method, like .findOneAndUpdate (for some reason it doesnt trigger for this) but for .create() it does.. https://mongoosejs.com/docs/middleware.html
// We are doing a pre method on 'save' so we can hash password before we save it

UserSchema.pre('save', async function() {

    // rewatch video 115 to understand line of code below
    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

// For .createJWT and .comparePassword below these are 'methods' that are done on a specific instance of a user vs. 'statics' which is done on the model. (compare to net ninja and see chatgpt answer for difference)

// Custom method to create JWT used in controller - in net ninja, this was defined on the controller
UserSchema.methods.createJWT = function () {
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}

// Custom method that compares password on req.body and stored hashed password that is used in the controller
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    // .compare() returns boolean. Note, this.password is not recieved as we set select: false on the password in the userSchema, we handle this on the controller
    return isMatch
}

export default mongoose.model('User', UserSchema);