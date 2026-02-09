import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { Link} from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const dispatch = useDispatch();
    const { isAuthenticated, data } = useSelector((state) => state.auth);
//  const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout functionality here
        console.log("Logout clicked");
        dispatch(logoutUser() );
    }

    // const handleDashboard = () => {
    //   Navigate("/dashboard");
    // }

  return (
  <nav className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold text-blue-600">
          Job<span className="text-gray-800">Portal</span>
        </span>
      </div>
      {isAuthenticated && (
        <>
        <Link to="/" className="text-gray-700 mr-4">Home</Link>
         <div className="text-gray-700">Welcome, {data.username}</div>
        <Link to="/job-provider-dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Dashboard
        </Link>
        </>
       
      )}
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        {/* Before Login */}

      

     {!isAuthenticated ? (<>
     <a href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
          Login
        </a>
        <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Register
        </a>
     </>) : (<button onClick={handleLogout} className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">Logout</button>)}


        {/* After Login (Show conditionally) */}
        {/*
  <button
    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
  >
    Logout
  </button>
  */}
      </div>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button id="menuBtn" className="text-2xl text-gray-700">☰</button>
      </div>
    </div>
  </div>
  {/* Mobile Menu */}
  <div id="mobileMenu" className="hidden md:hidden border-t bg-white">
    {/* Before Login */}
    <a href="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
      Login
    </a>
    <a href="/register" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
      Register
    </a>
    {/* After Login */}
    {/*
    <button
class="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
    >
Logout
    </button>
    */}
  </div>
</nav>

  )
}

export default Navbar
