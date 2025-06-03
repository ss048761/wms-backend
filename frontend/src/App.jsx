// D:\WMS\frontend\src\App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Import your page components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardOverview from './pages/DashboardOverview';
import InwardPage from './pages/InwardPage'; // Placeholder, ensure it exists or remove route
import InventoryPage from './pages/InventoryPage'; // Placeholder, ensure it exists or remove route
import WarehousesPage from './pages/WarehousesPage';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage'; // For creating new products

// Import ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userDataString = localStorage.getItem('userData');
    if (token && userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        setIsAuthenticated(true);
        setCurrentUserData(parsedUserData);
        console.log("App.jsx - useEffect (initial auth check) - User authenticated from localStorage:", parsedUserData);
      } catch (e) {
        console.error("App.jsx - useEffect (initial auth check) - Failed to parse user data from localStorage", e);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setCurrentUserData(null);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLoginSuccess = useCallback((userData) => {
    console.log("App.jsx - handleLoginSuccess received userData:", userData); 
    setIsAuthenticated(true);
    setCurrentUserData(userData);
    // LoginPage typically handles navigation to '/dashboard' after Swal
  }, []);

  const handleLogout = useCallback(() => {
    Swal.fire({
      title: 'Logging Out...',
      text: 'You have been logged out.',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-xl' }
    }).then(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setCurrentUserData(null);
      navigate('/login');
      console.log("App.jsx: User logged out.");
    });
  }, [navigate]);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard/overview', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, isLoadingAuth]);

  console.log("App.jsx - Rendering - isAuthenticated:", isAuthenticated, "currentUserData:", currentUserData, "isLoadingAuth:", isLoadingAuth); 

  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-slate-700">Loading Application...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
      } />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route 
            path="/dashboard" 
            element={<DashboardPage onLogout={handleLogout} currentUserData={currentUserData} />}
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="products" element={<ProductsPage />} /> 
          <Route path="products/new" element={<CreateProductPage />} /> {/* Route for creating new product */}
          <Route path="inward" element={<InwardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          {/* TODO: Add routes for all other sidebar items mentioned in your Sidebar.jsx
            For example:
            <Route path="receiving" element={<YourReceivingPageComponent />} />
            <Route path="putaway" element={<YourPutawayPageComponent />} />
            <Route path="orders" element={<YourOrdersPageComponent />} />
            ...etc.
            You'll need to create these page components (e.g., YourReceivingPageComponent.jsx)
            in your src/pages/ directory. For now, they will lead to 404s if clicked in sidebar
            unless you create placeholder components for them.
          */}
        </Route>
      </Route>

      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*" // Fallback for any unmatched route
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-slate-700">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <p className="mb-4">The page you are looking for does not exist or is not yet implemented.</p>
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard/overview')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go to Dashboard</button>
            ) : (
              <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go to Login</button>
            )}
          </div>
        }
      />
    </Routes>
  );
}

export default App;