import React from 'react'

import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Home'
import About from './About'
import Register from './pages/Register'
import Login from './pages/Login'
import JobProviderDashboard from './pages/JobProviderDashboard'
import Navbar from './pages/Navbar'
import JobCreateForm from './pages/JobCreateForm'
import SingleJob from './pages/SingleJob'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/job-provider-dashboard' element={<JobProviderDashboard/>}/>
          <Route path="/create-job" element={<JobCreateForm/>}/>
          <Route path="/jobgetbyid/:id" element={<SingleJob/>}/>

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
