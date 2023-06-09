import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';


function Job({ _id, position, company, jobLocation, jobType, createdAt, status }) {
    
    const { setEditJob, deleteJob } = useAppContext();

    // moment package makes dates display nicely
    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY')

    return (
        <Wrapper>
            <header>
                <div className='main-icon'>
                    {company.charAt(0)}
                </div>
                <div className='info'>
                    <h5>{position}</h5>
                    <h5>{company}</h5>
                </div>
            </header>
            <div className='content'>
                <div className='content-center'>
                    <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={jobType} />
                    <div className={`status ${status}`}>{status}</div>
                </div>
            </div>
            <footer>
                <div className='actions'>
                    <Link to='/add-job' onClick={() => setEditJob(_id)} className='btn edit-btn'>Edit</Link>
                    <button onClick={() => deleteJob(_id)} className='btn delete-btn'>Delete</button>
                </div>
            </footer>
        </Wrapper>

    )
}

export default Job;