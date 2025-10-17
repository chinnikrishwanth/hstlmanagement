import React, { useState } from 'react';
import LoginPage from './LoginPage';
import HostelManagement from './HostelManagement';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    // Simple authentication check
    if (loginFormData.username === 'hostel' && loginFormData.password === 'admin123') {
      setUser({ name: 'Admin', username: loginFormData.username });
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setLoginFormData({ username: '', password: '' });
    setLoginError('');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <HostelManagement user={user} handleLogout={handleLogout} />
      ) : (
        <LoginPage 
          onLogin={handleLogin}
          setLoginFormData={setLoginFormData}
          loginFormData={loginFormData}
          loginError={loginError}
        />
      )}
    </div>
  );
}

export default App;