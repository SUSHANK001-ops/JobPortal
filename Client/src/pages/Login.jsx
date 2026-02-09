import React from 'react'
import { loginUser } from '../store/authSlice';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");


    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);


    const navigate = useNavigate();


        const handleSubmit = (e) => {
            e.preventDefault();
            // Handle registration logic here
            console.log("Logging in user:", { email, password });
                 
            const data={
                userEmail: email,
                userPassword: password
            }
    
            dispatch(loginUser(data));

            if(authState.loading === "idle" && authState.error === null){
              navigate("/");
            }
    
        }
    

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold text-center mb-6">Login Account</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
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
        Login
      </button>
    </form>
  </div>
</div>
  )
}

export default Login
