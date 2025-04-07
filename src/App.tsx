
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './pages/main/main'
import Login from './pages/login'
import Navbar from './components/navbar'
import Signup from './pages/signup'
import CreatePost from './pages/create-post/create-post'


function App() {

  return (
    <>
      <div>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/create' element={<CreatePost/>}/>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
