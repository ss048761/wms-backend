// D:\WMS\frontend\src\pages\LoginPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using direct axios for login calls
import { auth } from '../firebaseConfig'; // Path relative to src/pages/
import { GoogleAuthProvider, signInWithPopup, getIdToken } from "firebase/auth";

// --- Icon components (ensure they are correctly defined or imported) ---
const EyeIcon = ({ className = "h-5 w-5" }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> </svg> );
const EyeSlashIcon = ({ className = "h-5 w-5" }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.575M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-18-18" /> </svg> );
const GoogleIcon = () => ( <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg"><path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"/><path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"/><path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"/><path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 340.1 0 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"/></svg> );
// --- End Icon components ---

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // This API_BASE_URL will be 'http://127.0.0.1:8000/api/v1' if VITE_API_URL is set to that.
  // Or 'http://127.0.0.1:8000' if VITE_API_URL is not set or set to that.
  const API_BASE_URL_LOGIN_PAGE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  // Let's be explicit: if VITE_API_URL is indeed the full path to /api/v1, then we use it.
  // Otherwise, we assume VITE_API_URL is just the domain and append /api/v1
  const effectiveApiRoot = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.includes('/api/v1')) 
                           ? import.meta.env.VITE_API_URL 
                           : `${API_BASE_URL_LOGIN_PAGE}/api/v1`;

  console.log("LoginPage effectiveApiRoot for auth calls:", effectiveApiRoot);


  const storeUserDataAndNavigate = (djangoResponseData, isGoogleLogin = false) => {
    // ... (rest of this function remains the same as you provided and we debugged)
    const djangoAccessToken = djangoResponseData.access;
    if (!djangoAccessToken) {
      console.error('LoginPage: No Django access token received in data:', djangoResponseData);
      Swal.fire({ icon: 'error', title: 'Login Error', text: 'Authentication token was not received from the server.', customClass: { popup: 'rounded-xl bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200' }});
      return false;
    }
    localStorage.setItem('accessToken', djangoAccessToken);
    if (djangoResponseData.refresh) {
        localStorage.setItem('refreshToken', djangoResponseData.refresh);
    }
    const userDataSource = isGoogleLogin ? djangoResponseData.user : djangoResponseData;
    if (!userDataSource) {
        console.error('LoginPage: User data source is missing in Django response.');
        Swal.fire({ icon: 'error', title: 'Login Error', text: 'User details not found in server response.', customClass: { popup: 'rounded-xl bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200' }});
        return false;
    }
    const userData = {
      userId: userDataSource.user_id || userDataSource.id,
      username: userDataSource.username,
      email: userDataSource.email,
      name: userDataSource.name || `${userDataSource.first_name || ''} ${userDataSource.last_name || ''}`.trim(),
      firstName: userDataSource.first_name,
      lastName: userDataSource.last_name,
      role: userDataSource.role_display || userDataSource.role,
      role_key: userDataSource.role,
      assignedWarehouses: userDataSource.assigned_warehouses || [],
      allocatedWarehouse: (userDataSource.assigned_warehouses && userDataSource.assigned_warehouses.length > 0)
                            ? userDataSource.assigned_warehouses[0]
                            : (userDataSource.allocatedWarehouse || null),
      profileActive: userDataSource.profile_active !== undefined ? userDataSource.profile_active : true,
    };
    Object.keys(userData).forEach(key => (userData[key] === undefined || userData[key] === null) && delete userData[key]);
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("LoginPage: User data being passed to onLoginSuccess and stored:", userData);
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(userData);
    }
    return true;
  };

  const handleRegularLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // CORRECTED URL CONSTRUCTION: Path is relative to effectiveApiRoot
      const response = await axios.post(`${effectiveApiRoot}/auth/token/`, { username, password });
      setIsLoading(false);
      if (storeUserDataAndNavigate(response.data, false)) {
        Swal.fire({ icon: 'success', title: 'Login Successful!', text: 'Redirecting...', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-xl bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200' }})
          .then(() => navigate('/dashboard'));
      } 
    } catch (error) {
      setIsLoading(false);
      console.error('LoginPage: Regular Login API Error:', error);
      let errorMessage = 'Login failed.';
      if (error.response) {
        if (error.response.status === 401) errorMessage = error.response.data.detail || 'Invalid username or password.';
        else errorMessage = `Server Error: ${error.response.data?.detail || error.response.statusText} (Status: ${error.response.status})`;
      } else if (error.request) errorMessage = 'No response from server. Is backend running?';
      else errorMessage = `Request Error: ${error.message}`;
      Swal.fire({ icon: 'error', title: 'Login Failed', text: errorMessage, customClass: { popup: 'rounded-xl bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200' }});
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const firebaseIdToken = await getIdToken(firebaseUser);

      // CORRECTED URL CONSTRUCTION: Path is relative to effectiveApiRoot
      const djangoAuthResponse = await axios.post(`${effectiveApiRoot}/wms/auth/login/firebase/`, { idToken: firebaseIdToken });
      setIsGoogleLoading(false);

      if (storeUserDataAndNavigate(djangoAuthResponse.data, true)) {
        Swal.fire({
          icon: 'success', title: 'Sign-In Successful!',
          text: `Welcome, ${djangoAuthResponse.data.user?.name || firebaseUser.displayName || 'User'}! Redirecting...`,
          timer: 2000, showConfirmButton: false, customClass: { popup: 'rounded-xl bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200' }
        }).then(() => navigate('/dashboard'));
      }
    } catch (error) {
      setIsGoogleLoading(false);
      console.error("LoginPage: Google Sign-In or Django Auth Error:", error);
      let errorMessage = 'Google Sign-In failed.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.error || `Server error (${error.response.status}).`;
      } else if (error.code) {
        errorMessage = `Google Sign-In Error: ${error.message} (Code: ${error.code})`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({ icon: 'error', title: 'Sign-In Failed', text: errorMessage, customClass: { popup: 'rounded-xl bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200' }});
    }
  };

  return (
    // ... (rest of your JSX remains the same) ...
    <div className="min-h-screen w-full flex bg-cover bg-center" style={{ backgroundImage: "url('/back1.png')" }}>
      <div className="w-1/2 md:w-3/5 lg:w-2/3 hidden md:block"></div>
      <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <div className="bg-white/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md dark:bg-slate-800/60 dark:text-slate-200">
          <form onSubmit={handleRegularLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-800 dark:text-slate-300 mb-1">Username</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-400/70 dark:border-slate-600/70 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 ease-in-out hover:border-sky-600 dark:hover:border-sky-400 placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="Enter your username" required disabled={isGoogleLoading || isLoading} />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800 dark:text-slate-300 mb-1">Password</label>
              <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-400/70 dark:border-slate-600/70 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 ease-in-out hover:border-sky-600 dark:hover:border-sky-400 placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="••••••••" required disabled={isGoogleLoading || isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isGoogleLoading || isLoading}
                      className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200">
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <button type="submit" disabled={isLoading || isGoogleLoading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ease-in-out transform ${(isLoading || isGoogleLoading) ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 hover:scale-105 active:scale-100 focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 dark:from-sky-500 dark:to-blue-600 dark:hover:from-sky-400 dark:hover:to-blue-500'}`}>
              {isLoading ? 'Signing In...' : 'SIGN IN'}
            </button>
          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-400/60 dark:border-slate-600/60"></div>
            <span className="mx-4 text-sm text-slate-600 dark:text-slate-400">or</span>
            <div className="flex-grow border-t border-slate-400/60 dark:border-slate-600/60"></div>
          </div>
          <button type="button" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}
                  className={`w-full flex items-center justify-center py-3 px-4 text-blue-700 dark:text-sky-400 bg-transparent hover:bg-white/30 dark:hover:bg-slate-700/50 border border-blue-500/50 dark:border-sky-500/50 hover:border-blue-500/70 dark:hover:border-sky-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/70 dark:focus:ring-sky-500/70 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 group ${(isLoading || isGoogleLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isGoogleLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </div>
            ) : (
              <>
                <GoogleIcon />
                <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center text-slate-200/70 text-xs backdrop-blur-sm p-1 rounded">
        &copy; {new Date().getFullYear()} WMS Corp. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;