import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR, LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, HANDLE_CHANGE, CLEAR_VALUES, CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, SET_EDIT_JOB, DELETE_JOB_BEGIN, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, SHOW_STATS_BEGIN, SHOW_STATS_SUCCESS, CLEAR_FILTERS, CHANGE_PAGE } from "./actions"
import { initialState } from './appContext';

const reducer = (state, action) => {
    switch(action.type) {
        case DISPLAY_ALERT:
            return {
                ...state,
                showAlert: true,
                alertType: 'danger',
                alertText: 'Please provide all values!'
            }
        case CLEAR_ALERT:
            return {
                ...state,
                showAlert: false,
                alertType: '',
                alertText: ''
            }
        case REGISTER_USER_BEGIN:
            return {
                ...state,
                isLoading: true
            }
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                token: action.payload.token,
                user: action.payload.user,
                userLocation: action.payload.location,
                jobLocation: action.payload.location,
                showAlert: true,
                alertType: 'success',
                alertText: 'User created! Redirecting...'
            }
        case REGISTER_USER_ERROR:
            return {
                ...state,
                isLoading: false,
                showAlert: true,
                alertType: 'danger',
                alertText: action.payload.msg
            }
            case LOGIN_USER_BEGIN:
                return {
                    ...state,
                    isLoading: true
                }
            case LOGIN_USER_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    token: action.payload.token,
                    user: action.payload.user,
                    userLocation: action.payload.location,
                    jobLocation: action.payload.location,
                    showAlert: true,
                    alertType: 'success',
                    alertText: 'Login Successful! Redirecting...'
                }
            case LOGIN_USER_ERROR:
                return {
                    ...state,
                    isLoading: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertText: action.payload.msg
                }
            case TOGGLE_SIDEBAR:
                return {
                    ...state,
                    showSidebar: !state.showSidebar
                }
            case LOGOUT_USER:
                return {
                    // I guess we could set all values, but easier to just reset the initial state?
                    ...initialState,
                    user: null,
                    token: null,
                    jobLocation: '',
                    userLocation: ''
                }
            case UPDATE_USER_BEGIN:
                return {
                    ...state,
                    isLoading: true
                }
                // Note we are setting a new token because so the token request has all the most up to date info (see chatgpt answer)
            case UPDATE_USER_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    token: action.payload.token,
                    user: action.payload.user,
                    userLocation: action.payload.location,
                    jobLocation: action.payload.location,
                    showAlert: true,
                    alertType: 'success',
                    alertText: 'Update Successful!'
                }
            case UPDATE_USER_ERROR:
                return {
                    ...state,
                    isLoading: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertText: action.payload.msg
                }
            case HANDLE_CHANGE: 
                return {
                    ...state,
                    // This resets the page number to 1 for each re-render of the jobs page (pagnination stuff)
                    page: 1,
                    // this is the dynamic updating stuff from John's JS nuggets 
                    [action.payload.name]: action.payload.value
                }
            case CLEAR_VALUES:
                return {
                    ...state,
                    isEditing: false,
                    editJobId: '',
                    position: '',
                    company: '',
                    jobLocation: state.userLocation,
                    jobType: 'full-time',
                    status: 'pending'
                }
            case CREATE_JOB_BEGIN:
                return {
                    ...state,
                    isLoading: true
                }
            case CREATE_JOB_SUCCESS:
                return {
                    // Note: our state already contains all the job prorperties such as status, type etc from the HANDLE_CHANGE case above
                    ...state,
                    isLoading: false,
                    showAlert: true,
                    alertType: 'success',
                    alertText: 'New Job Created'
                }
            case CREATE_JOB_ERROR:
                return {
                    ...state,
                    isLoading: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertText: action.payload.msg
                }
            case GET_JOBS_BEGIN:
                return {
                    ...state,
                    isLoading: true,
                    showAlert: false
                }
            case GET_JOBS_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    jobs: action.payload.jobs,
                    totalJobs: action.payload.totalJobs,
                    numOfPages:  action.payload.numOfPages
                }
            case SET_EDIT_JOB:
                // Didn't exactly get this, but idea is that we have the jobs array already in our state, so we are just finding the exact job using the id 
                const job = state.jobs.find((job) => job._id === action.payload.id)
                const { _id, position, company, jobLocation, jobType, status } = job
                return {
                    ...state,
                    isEditing: true,
                    editJobId: _id,
                    position,
                    company,
                    jobLocation,
                    jobType,
                    status   
                }
            case EDIT_JOB_BEGIN:
                return {
                    ...state,
                    isLoading: true
                }
            case EDIT_JOB_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    showAlert: true,
                    alertType: 'success',
                    alertText: 'Job Updated!'
                }
            case EDIT_JOB_ERROR:
                return {
                    ...state,
                    isLoading: false,
                    showAlert: true,
                    alertType: 'danger',
                    alertText: action.payload.msg
                }
            case DELETE_JOB_BEGIN:
                return {
                ...state,
                isLoading: true
            }
            case SHOW_STATS_BEGIN:
                return {
                    ...state,
                    isLoading: true,
                    showAlert: false
                }
            case SHOW_STATS_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    stats: action.payload.stats,
                    monthlyApplications: action.payload.monthlyApplications
                }
            
            case CLEAR_FILTERS:
                return {
                    ...state,
                    search: '',
                    searchStatus: 'all',
                    searchType: 'all',
                    sort: 'latest'
                }
            case CHANGE_PAGE:
                return {
                    ...state,
                    page: action.payload.page
                }  
            default:
                    throw new Error(`no such action: ${action.type}`)
            
            }
    }

export default reducer

