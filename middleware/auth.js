import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthenticatedError('Authentication Invalid')
    }

    const token = authHeader.split(' ')[1]
    try {
        // the verify will return an object like this: { userId: '641989184bcd4a4f17dee16a', iat: 1679511396, exp: 1679597796 } this we defined in the Model UserSchema: jwt.sign({userId: this._id}
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // We put the user id as a property on the request object which we will access and use elsehwere in the app
        req.user = { userId : payload.userId }
        console.log('req.user: ', req.user)
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid')
    }    
}

export default auth