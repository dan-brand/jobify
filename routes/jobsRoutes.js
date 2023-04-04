import express from 'express';
const router = express.Router();

import { createJob, deleteJob, getAllJobs, updateJob, showStats } from '../controllers/jobsController.js';

router.get('/', getAllJobs);
router.post('/', createJob);

router.get('/stats', showStats);

router.delete('/:id', deleteJob);
router.patch('/:id', updateJob);

export default router;

// note we do authentication inside server.js app.use('/api/v1/jobs', authenticateUser, jobsRouter) - it will apply the authenticateUser middleware to all the routes above