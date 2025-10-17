import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    // Simple authentication check (demo credentials)
    if (loginFormData.username === "hostel" && loginFormData.password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginFormData({ username: "", password: "" });
    setLoginError("");
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        setLoginFormData={setLoginFormData}
        loginFormData={loginFormData}
        loginError={loginError}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      username={loginFormData.username}
    />
  );
}
