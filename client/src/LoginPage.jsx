import React from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage({ onLogin, setLoginFormData, loginFormData, loginError }) {
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const isFormValid = loginFormData.username && loginFormData.password;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8">
        
        <div className="flex justify-start items-center mb-6 border-b pb-4">
          <LogIn size={28} className="text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Hostel Management Login</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Please log in to access the system.
          <br />
          <span className="font-semibold text-red-500">Demo Credentials:</span> username: **hostel**, password: **admin123**
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={loginFormData.username || ''}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={loginFormData.password || ''}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="current-password"
              required
            />
          </div>
          
          {loginError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              isFormValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
          >
            <LogIn size={20} />
            Log In
          </button>

        </form>
      </div>
    </div>
  );
}
