import { useState } from 'react';
import { FormRow, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

function Profile() {

    const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext();
    
    // note: only time user will be null is when we haven't logged in yet - not sure why this is neccessary, given we can only get to profile page when we are logged in?
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [lastName, setLastName] = useState(user?.lastName);
    const [location, setLocation] = useState(user?.location);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name || !email || !lastName | !location) {
        displayAlert()
        return
      }
     updateUser({name, email, lastName, location})
    }

    
    return (
      <Wrapper>
        <form onSubmit={handleSubmit} className='form'>
          <h3>Profile</h3>
          {showAlert && <Alert />}
          <div className='form-center'>
            <FormRow type='text' name='name' value={name} handleChange={(e) => setName(e.target.value)} />
            <FormRow type='text' name='lastName' value={lastName} handleChange={(e) => setLastName(e.target.value)} labelText='last name' />
            <FormRow type='email' name='email' value={email} handleChange={(e) => setEmail(e.target.value)} />
            <FormRow type='text' name='location' value={location} handleChange={(e) => setLocation(e.target.value)} />
            <button className='btn btn-block' disabled={isLoading}>{isLoading ? 'Please wait' : 'Save Changes'}</button>
          </div>

        </form>
      </Wrapper>
    )
  }
  
  export default Profile;
  