import { useReducer, useContext, createContext } from 'react';
import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR, LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, HANDLE_CHANGE, CLEAR_VALUES, CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, SET_EDIT_JOB, DELETE_JOB_BEGIN, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, SHOW_STATS_BEGIN, SHOW_STATS_SUCCESS, CLEAR_FILTERS, CHANGE_PAGE } from './actions';
import reducer from './reducer';
import axios from 'axios';

// If the user exists and values are in local storage, we grab these straight away from local storage so data persists between refresh as they are stored in initialState which is the state object passed into the values object in the Provider
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['interview', 'declined', 'pending'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a']
}

const AppContext = createContext();

function AppProvider({children}) {
    // Note reducer function is in a seperate file
    const [state, dispatch] = useReducer(reducer, initialState);

    // We are setting up an instance using axios library to pass in the bearer token automatically with each request for the set base url

    const authFetch = axios.create({
        baseURL: '/api/v1',
      });

    // We have to do below so be able to return 401 errors - didn't really follow video 122/123
    // I think we are doing this whole interceptor thing so we can globally handle 401 errors. In a regular axios repsonse we can add .catch() and check for 401 status error and handle it (chatgpt convo says 'you can handle 401 errors in one place as opposed to having it on every axios request)

    // request interceptor
      authFetch.interceptors.request.use(
        (config) => {
          config.headers['Authorization'] = `Bearer ${state.token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // response interceptor
      authFetch.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          console.log(error.response);
          if (error.response.status === 401) {
            // We logout user as if 401 error, they should be logged out as they are unauthorized
            logoutUser();
          }
          return Promise.reject(error);
        }
      );
    
    // Dispatch function to display the alert that is passed as a value into the Provider below
    const displayAlert = () => {
        dispatch({
            type: DISPLAY_ALERT
        })
        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({
                type: CLEAR_ALERT
            })
        }, 3000)
    }

    const registerUser = async (currentUser) => {
        dispatch({
            type: REGISTER_USER_BEGIN,
        })
        try {
            // axis returns a response object with data property, so we are destructuing 'data' from the response object 
            const response = await axios.post('/api/v1/auth/register', currentUser);
            // console.log(response);
            const { user, token, location } = response.data;
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                }
            })
            // adds to local storage
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            // console.log(error.response)
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert();
    }

    // Functions to add and remove from local storge (not sure why we pass user, token and location as an object, not passing as an object also works)

    const addUserToLocalStorage = ({ user, token, location }) => {
        // user is an object, so need to convert to a string
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }

    // Dispatch function to login user (very similar to register user above)
    const loginUser = async (currentUser) => {
        dispatch({
            type: LOGIN_USER_BEGIN,
        })
        try {
            const { data } = await axios.post('/api/v1/auth/login', currentUser);
            const { user, token, location } = data;
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                }
            })
            // adds to local storage
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert();
    }

    const toggleSidebar = () => {
        dispatch({
            type: TOGGLE_SIDEBAR
        })
    }

    const logoutUser = () => {
        dispatch({
            type: LOGOUT_USER
        })
        removeUserFromLocalStorage()
    }

    // 'MANUAL' AXIOS APPROACH

    // const updateUser = async (currentUser) => {
    //     try {
    //     // axis returns a response object with data property, so we are destructuing 'data' from the response object 
    //     // On the Authcontroller, we have const { email, name, lastName, location } = req.body; we are passing in the current user as the request body which is an object from the Profile.js: updateUser({name, email, lastName, location})
    //     // Note the data we get back is defined on the controller: res.status(StatusCodes.OK).json({user, token, location: user.location})
    //       const { data } = await axios.patch('/api/v1/auth/updateUser', currentUser, {
    //         headers: {
    //           Authorization: `Bearer ${state.token}`,
    //         },
    //       });
    //       console.log(data);
    //     } catch (error) {
    //       console.log(error.response);
    //     }
    //   };
          
      const updateUser = async (currentUser) => {
        dispatch({
            type: UPDATE_USER_BEGIN
        })
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser);
            const { user, location, token } = data;
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {
                    user,
                    location,
                    token
                }
            })
            addUserToLocalStorage({user, location, token})
        } catch (error) {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert();
      };

    // This is a general handleChange function used throughout the app to prevent us repetiviely writting the handleChange callback
    const handleChange = ({name, value}) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: {
                name,
                value
            }
        })
    }

    const clearValues = () => {
        dispatch({
            type: CLEAR_VALUES
        })
    }

    const createJob = async () => {
        dispatch({
            type: CREATE_JOB_BEGIN
        })
        try {
            // All values we need are in the global state, that is why this is empty async () and we just get values from the global state
            const { position, company, jobLocation, jobType, status } = state
            // We don't need a response so it is just 'await', we also have interceptors that add token from get go as well as base URL
            await authFetch.post('/jobs', {
                position,
                company,
                jobLocation, 
                jobType, 
                status
            })
            dispatch({
                type: CREATE_JOB_SUCCESS
            })
            dispatch({
                type: CLEAR_VALUES
            })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
    }

    const getJobs = async () => {
        const { page, search, searchStatus, searchType, sort } = state;
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        
        if(search) {
            url = url + `&search=${search}`
        }


        dispatch({
            type: GET_JOBS_BEGIN
        })

        try {
            // by default it is get, so we could just write await authFetch(url);
           const { data } = await authFetch.get(url);
           const { jobs, totalJobs, numOfPages } = data
           dispatch({
            type: GET_JOBS_SUCCESS,
            payload: {
                jobs,
                totalJobs,
                numOfPages
            }
           })
        } catch (error) {
            console.log(error.response)
            // we shouldnt be getting 404 or 500 errors, we should just logout - didn't fully get this video 142
            logoutUser();
        }
        clearAlert()
    }

    const setEditJob = (id) => {
       dispatch({
        type: SET_EDIT_JOB,
        payload: {
            id
        }
       })
      }

    const editJob = async () => {
        dispatch({
            type: EDIT_JOB_BEGIN
        })
        try {
            // Recall, that we already have all values in the state from setEditJob which is invoked: onClick={() => setEditJob(_id)} in Job.s
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status
            })
            dispatch({
                type: EDIT_JOB_SUCCESS
            })
            dispatch({
                type: CLEAR_VALUES
            })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert();
    }
      
    const deleteJob = async (jobId) =>{
        dispatch({
            type: DELETE_JOB_BEGIN
        })
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            // We invoke getJobs() to update the state of all jobs from the db as one will be removed
            getJobs()
        } catch (error) {
            console.log(error.response);
            // I guess we would getting back a 401 from the axios interceptors, so we should just log them out 
            logoutUser()
        }
      }

    const showStats = async () => {
        dispatch({
            type: SHOW_STATS_BEGIN
        })
        try {
            const { data } = await authFetch.get('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                }
            })
        } catch (error) {
            console.log(error.response)
            logoutUser()
        }   
        clearAlert()
    }

    const clearFilters = () => {
        dispatch({
            type: CLEAR_FILTERS
        })
    }

    const changePage = (page) => {
        dispatch({ 
            type: CHANGE_PAGE, 
            payload: { 
                page 
            } 
        })
    }

    return (
        // Spreading the state gives us an object initially of {isLoading: false, showAlert: false, alertText: '', alertType: '', displayAert}
        <AppContext.Provider value={{...state, displayAlert, registerUser, loginUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValues, createJob, getJobs, setEditJob, deleteJob, editJob, showStats, clearFilters, changePage }}>
            {children}
        </AppContext.Provider>
    )
}

// Hook to eventually use context in application, some people do this in a seperate hooks folder
const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }