import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

function AddJob() {
    const { isLoading, isEditing, showAlert, displayAlert, position, company, jobLocation, jobType, jobTypeOptions, status, statusOptions, handleChange, clearValues, createJob, editJob } = useAppContext();

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!position || !company || !jobLocation) {
        displayAlert()
        return
      }

      // Inside Job.js we have the edit button that calls the SET_EDIT_JOB action in the reducer, this sets isEditing: true and collects all job state values. We then invoke editJob()
      // recall we are are using the AddJob page to handle both editing and adding, so that is why we have this if statement below to handle the editing case
      // We are not passing any values into editJob() as we are getting these values from the state when we called onClick={() => setEditJob(_id)} inside the edit button in Job.js
      if (isEditing) {
        editJob()
        return
      }
      
      createJob();
    }
    
    const handleJobInput = (e) => {
      const name = e.target.name
      const value = e.target.value
      handleChange({ name, value })
    }

    const handleClear = (e) => {
      e.preventDefault();
      clearValues();
    }
    
    return (
      <Wrapper>
        <form className='form'>
          <h3>{isEditing ? 'edit job' : 'add job'}</h3>
          {showAlert && <Alert />}
          <div className='form-center'>
            <FormRow type='text' name='position' value={position} handleChange={handleJobInput} />
            <FormRow type='text' name='company' value={company} handleChange={handleJobInput} />
            <FormRow type='text' labelText='Job Location' name='jobLocation' value={jobLocation} handleChange={handleJobInput} />
            <FormRowSelect name='status' value={status} handleChange={handleJobInput} list={statusOptions} />
            <FormRowSelect name='jobType' labelText='Job Type' value={jobType} handleChange={handleJobInput} list={jobTypeOptions} />
            <div className='btn-container'>
              <button onClick={handleSubmit} disabled={isLoading} className='btn btn-block submit-btn'>Submit</button>
              <button onClick={handleClear} className='btn btn-block clear-btn'>Clear</button>
            </div>
          </div>
        </form>
      </Wrapper>
    )
  }
  
  export default AddJob;
  