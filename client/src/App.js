import { Register, Landing, Error, ProtectedRoute } from './pages';
import { AddJob, AllJobs, Profile, Stats, SharedLayout} from './pages/dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// {<ProtectedRoute><SharedLayout /></ProtectedRoute> - we wrap the shared loyout in a ProtectedRoute componet to redirect to landing page is there is no user i.e. when we logout, user is set back to null and takes us back to landing (see ProtectedRoute.js)

// Test comment for Github/render test