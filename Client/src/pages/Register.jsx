import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Register = () => {
   
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const  authState= useSelector((state)=>state.auth);
  

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        console.log("Registering user:", { name, email, password });
             
        const data={
            username: name,
            userEmail: email,
            userPassword: password
        }

        dispatch(registerUser(data));

        if(authState.loading === "idle" && authState.error === null){
          navigate("/login");
        }

    }

    

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text" 
          value={name}

          onChange={(e)=>setName(e.target.value)}
          placeholder="Enter username"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

    
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>

        <input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          type="password"
          placeholder="Enter password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  </div>
</div>

  )
}

export default Register
