import Job from '../models/Jobs.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';


const createJob = async (req, res) => {
    const { position, company } = req.body

    if (!position || !company) {
        throw new BadRequestError('please provide all values')
    }

    // We are going to add a property 'createdBy' onto the req.body (i.e along with position, company etc), I think we want to call it 'createdBy' to match what we call it in our JobsScehema
    // This is simply the userId, we get this from the req.user.userId we defined in our auth middleware (see 2 files refrenced below)
    // Server.js: app.use('/api/v1/jobs', authenticateUser, jobsRouter);
    // auth Middelware: req.user = { userId : payload.userId }

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    // note, passing {job}, is same as {job: job}, so we just get an object called 'job' with all those properties
    res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;
  
    const job = await Job.findOne({ _id: jobId });
  
    if (!job) {
      throw new NotFoundError(`No job with id : ${jobId}`);
    }
  
    checkPermissions(req.user, job.createdBy);
  
    // In Johns code it is .remove() instead of .deleteOne(), a guy commented on video 153 to do this and it works
    await job.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
  };
const getAllJobs = async (req, res) => {
  // On frontend, we have default value 'all', which is not defined in our Schema, so we need to do some conditional checks and then we pass in the status, otherwise it will be omitted such that it default to 'all' 
  
  const { search, status, jobType, sort } = req.query;

  // We return all jobs for a specifc user. Recall we have auth Middelware: req.user = { userId : payload.userId } which is set on server.js
  const queryObject = {
    createdBy: req.user.userId
  }

  if (status !== 'all') {
    queryObject.status = status;
  }

  if (jobType !== 'all') {
    queryObject.jobType = jobType;
  } 

  // if we did queryObject.position = search, this would only work for exact search 'Software Test Engineer' and no 'S' would not show any results, regex helps with this.
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  let result = Job.find(queryObject)

  // Chaining sort conditions - https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }

  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('position');
  }

  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // Pagination - we use Number to convert from string to Number note, we will be passing the page and limit from the front end
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; 
  result = result.skip(skip).limit(limit);

  // doing await here is what actually queries the database - still dont really get how this works with querying a db, I guess maybe just setting it up?
  const jobs = await result;

  // Setting totalJobs and NumOfPages - note for total jobs, the initial queryObject will have 75 documents as everything is set to all, and this will change based on search/filter criteria on front end, such that we display 'xxx jobs' nicely on front end
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({jobs: jobs, totalJobs, numOfPages})
}

const updateJob = async (req, res) => {
    // We are giving the id an alias of 'jobId', we get this from the route router.patch('/:id', updateJob);
    const { id: jobId } = req.params;
    const { company, position } = req.body

    if (!position || !company) {
        throw new BadRequestError('Please provide all values');
    }

    const job = await Job.findOne({ _id: jobId });
    
    if (!job) {
        throw new NotFoundError(`No job with id :${jobId}`);
    }

    // check permisssions a util we define - at the moment we are authenticating user, but if another user managed to get a job id, they could go and edit the job - watch video 152 to understand the issue
    // You could just pass in the user id, but we are passing the entire req.user object so in future, you can also check for roles like role=admin
    checkPermissions(req.user, job.createdBy);

    // see details on fineOneAndUpdate: https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {
        // returns the updated job, otherwise by default returns the original job
        new: true,
        // I believe this is a mongoose thing where it validates things on the JobsSchema like any property that is 'required'
        runValidators: true
    })

    res.status(StatusCodes.OK).json({updatedJob})

    // alternative approach using job.save() - video 150

    // job.position = position;
    // job.company = company;
    // job.jobLocation = jobLocation;

    // await job.save();
    // res.status(StatusCodes.OK).json({ job });
}

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // stats is currently an array of objects: "stats": [ { "_id": "pending", "count": 26 }, { "_id": "interview", "count": 24 }, { "_id": "declined", "count": 25 } ] we want to convert to a single object stats: {pending: 26, interview: 24, declined: 25}

    // stats = stats.reduce((acc, curr) => {
    //     const { _id: title, count } = curr;
    //     acc[title] = count;
    //     return acc;
    //   }, {});

    // finalObject[title] = count => {pending: 26, interview: 24, declined: 25}

    stats = stats.reduce((finalObject, item) => {
        const { _id: title, count } = item;
        finalObject[title] = count;
        return finalObject;
    }, {});

    // We on backend set up default values as case when user just signs up all values will be 0. Could do on frontend, but have done on backend
    // if no stats.pending, will be null (falsy) so then would default to 0, same for others   

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
      };
      
      let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
          $group: {
            _id: { 
                year: { $year: '$createdAt' }, 
                month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ]);

      monthlyApplications = monthlyApplications.map((item) => {
            // Destructuring year, month and count from each item
            const { _id: { year, month }, count} = item;
            // 'month' accepts 0-11, need to month -1 
            const date = moment().month(month - 1).year(year).format('MMM Y');
            return { date, count };
        })
        // reverse it becasue on front end, we need the oldest month first
        .reverse();

      res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });

    };

export { createJob, deleteJob, getAllJobs, updateJob, showStats }




