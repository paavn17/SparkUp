
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './pages/main/main'
import Login from './pages/login'
import Navbar from './components/navbar'
import Signup from './pages/signup'
import CreatePost from './pages/create-post/create-post'
import ProtectedRoute from './components/protectedroute'
// import Profile from './components/profile'
import UserProfile from './pages/userprofile'


function App() {

  return (
    <>
      <div>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Main /> </ProtectedRoute>}/>
            {/* <Route path="/profile" element={<ProtectedRoute><Profile /> </ProtectedRoute>}/> */}
            <Route path="/login" element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/create' element={<CreatePost/>}/>
            <Route path="/profile/:userid" element={<UserProfile />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
