import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Loading from './Loading';
import Job from './Job';
import Wrapper from '../assets/wrappers/JobsContainer';
import PageBtnContainer from './PageBtnContainer';

function JobsContainer() {
    
    const { getJobs, jobs, isLoading, page, totalJobs, search, searchStatus, searchType, sort, numOfPages } = useAppContext();

    // Note - eslint-disable-next-line removes an error, John said this is fast and dirty approach, 'useCallBack' hook proper way of sorting this out - Stephen goes into detail in this in his course I am pretty sure.. 
    // I found it a bit confusing why getJobs() is called in the jobs container, I guess we need it to get all the jobs, but note we are using it as part of the searching functionality as well, that is why we have the dependancy array
    // The dependency array has [search, searchStatus, searchType, sort] as we want to call getJobs() anytime those state values change
    useEffect(() => {
        getJobs()
        // eslint-disable-next-line
    }, [search, searchStatus, searchType, sort, page])

    if (isLoading) {
        return (
            <Loading center='center' />
        )
    }

    if (jobs.length === 0) {
        return (
            <Wrapper>
                <h2>No jobs to display </h2>
            </Wrapper>
        )
    }

    const renderedJobs = jobs.map((job) => {
        return (
            // ...job passes the entire object for each job i.e. all key/value pairs for a specific job {comapny: 'Apple', status: 'pending', position: 'front-end', etc..}
            // This is a react 'nugget' watch this video: https://www.youtube.com/watch?v=vR1psFPE92M
            <Job key={job._id} {...job} />
        )
    })

    return (
       <Wrapper>
         <h5>{totalJobs} job{jobs.length > 1 && 's'}</h5>
         <div className='jobs'>
            {renderedJobs}
         </div>
         {numOfPages > 1 && <PageBtnContainer />}
       </Wrapper>
    )
}

export default JobsContainer;