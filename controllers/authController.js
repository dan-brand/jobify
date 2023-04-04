import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

// const register = async (req, res, next) => {
//     try {
//         const user = await User.create(req.body);
//         res.status(201).json({user});
//     } catch (error) {
//         // The error is passed to the errorHandler middleware in the server.js file 
//         next(error);
//     }
// }

// Note, using express-async-errors we replace code above with next and next(error) with code below and the package automatically takes care of try/catch block and passes error to errorHandler middleware

const register = async (req, res) => {
    const { name, email, password } = req.body

    // John mentioned something about we are using express-async-errors package, so usually we'd have to do next(), didn't really follow
    // I guess this would throw an error before it would hit a try/catch block and usually we'd need to mnaually do next(error) to pass the error to the error middleware, but in this case we don't need to do that beacuse of the express-async-errors package
    if (!name || !email || !password) {
        // BadRequestError is custom error stuff to handle general errors like
        throw new BadRequestError('please provide all values')
    }

    // Another error handler on the controller
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new BadRequestError('Email already in use');
    }

    const user = await User.create({name, email, password});
    // From our custom instance method in the User Model
    const token = user.createJWT();
    // select: false for passwrod in User model (which prevents password being sent to frontend) does not work on .create() method.. no idea why.. we create our own user object without the password
    res.status(StatusCodes.CREATED).json({ user: {email: user.email, lastName: user.lastName, location: user.location, name: user.name}, token });
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('please provide all values')
    }

    // expaliner for .select('+password'). When we set on the UserScehma for password 'select: false' this hides the password from the document for the .findOne(), so we need to get it. Note for .create() above, the password is actually sent, that is why we make a while song and dance of specify which properties we want from the user 
    const user = await User.findOne({ email }).select('+password')
    if(!user) {
        throw new UnAuthenticatedError('Invalid credentials')
    }

    const isPasswordCorret = await user.comparePassword(password)

    if (!isPasswordCorret) {
        throw new UnAuthenticatedError('Invalid credentials')
    }

    const token = user.createJWT()

    // For response, we can do same in regist with .json({ user: {email: user.email, lastName: user.lastName, location: user.location, name: user.name}, token }); but we can also just set pasword to undefined
    user.password = undefined;
    res.status(StatusCodes.OK).json({user, token, location: user.location})


}

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body;
    
    if (!email || !lastName || !name || !location) {
        throw new BadRequestError('Please provide all values')
    }

    const user = await User.findOne({ _id: req.user.userId });

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location
    
    // Mongoose middleware is hard...... https://mongoosejs.com/docs/middleware.html
    // There are some methods like .save() that will trigger the UserSchema.pre('save', async function() in User Model. Note some methods like .findOneAndUpdate() would not trigger this hook
    // As UserSchema.pre('save', async function() is triggered, it is expecting this.password, but because we have on the schema pasword - select: false, it does not get a password and therefore has an error
    // This was not an issue for register, User.create() automatically fires save() hooks, but we are actually getting password from  we just dont give it to user a we create a custom .json response.
    // Solution is to add if statement for !this.isModified('password') inside the UserSchema.pre
    await user.save();

    // we create a new token, this is optional (as the token just cares about userId which is unchanged) but is john's preference as we will have a set of updated values and also resets the token expiry
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user, token, location: user.location})
}

export { register, login, updateUser }