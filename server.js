import 'express-async-errors';
import morgan from 'morgan';
import express from 'express';
import connectDb from './db/connect.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';
import authenticateUser from './middleware/auth.js'
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js'
dotenv.config();

// imports for static assets - something about some of these specific to ES6 modules we are using..
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// security imports
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

// MIDDLEWARE (this has to come before routes)

// morgan
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// build in json middleware that parses form payload as json (from what i remember..)
app.use(express.json());

// security packages
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Needed for our react front end static asssets,  note these are public assets - some of this I tihnk is maybe this ES6 module stuff...
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));


// ROUTES

// note we are passing in authenticateUser middleware as it applies to all the jobs Routes (we could also pass this in to all routes individually if we wanted to instead)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// This needs to come after the app.use, code below is all about serving up our react app 
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

// MIDDLEWARE (these have to come after routes)

// This runs after all routes above and runs if no routes exist
app.use(notFoundMiddleware)
// This checks for errors and has to come last
app.use(errorHandlerMiddleware)


// DATABASE

const port = process.env.PORT || 5000

// Starting server - note: mongoose.connect() inside connect.js returns a promise so we need to use async

const start = async() => {
    try {
        await connectDb(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start();