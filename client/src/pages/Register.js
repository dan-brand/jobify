import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from '../components';
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
}

function Register() {

  // Local State
  const [values, setValues] = useState(initialState);

  // Global State from Context
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } = useAppContext();
  
  // Naviagte hook from react-router-dom to redirect once user is registered
  const navigate = useNavigate();

  // Callbacks
  const toggleMember = () => {
    setValues({...values, isMember: !values.isMember})
  }
  
  const handleChange = (e) => {
    // Super cool way to do handleChange all in one with dynamic object pairs: https://hackmamba.io/blog/2020/11/dynamic-javascript-object-keys/
    setValues({...values, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    
    if(!email || !password || (!isMember && !name)) {
      displayAlert();
      return
    }

    const currentUser = {
      name: name,
      email: email,
      password: password
    }

    if (isMember) {
      loginUser(currentUser)
    } else {
      registerUser(currentUser)
    }

  }

  // useEffect to handle redirect one user registers. Note the setTimeout is optional, John just does this to show the alert before for 3s
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate])

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>  
        <Logo />
        {showAlert && <Alert />}
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {!values.isMember && <FormRow name="name" type="text" handleChange={handleChange} value={values.name} />}
        <FormRow name="email" type="email" handleChange={handleChange} value={values.email} />
        <FormRow name="password" type="password" handleChange={handleChange} value={values.password} />
        <button type='submit' className="btn btn-block" disabled={isLoading}>Submit</button>
        <p>
          {values.isMember ? 'Not a member yet' : 'Already a member?'}
          <button type="button" onClick={toggleMember} className='member-btn'>{values.isMember ? 'Register' : 'Login'}</button>
        </p>
      </form>
    </Wrapper>

    )
  }
  
  export default Register;
  