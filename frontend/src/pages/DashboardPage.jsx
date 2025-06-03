// D:\WMS\frontend\src\pages\DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // CORRECTED IMPORT PATH
import { BsPersonCircle } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';

const DashboardPage = ({ onLogout, currentUserData }) => { // Added currentUserData prop
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controls mobile sidebar visibility
  const [currentUser, setCurrentUser] = useState({ 
    name: 'User', 
    role: 'Role', 
    avatarUrl: '', 
    allocatedWarehouseName: '' 
  });
  const location = useLocation();

  useEffect(() => {
    // Use currentUserData from props if available, otherwise fallback to localStorage
    // This allows App.jsx to be the single source of truth for user data after login
    let dataToUse = currentUserData;

    if (!dataToUse) {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                dataToUse = JSON.parse(storedUserData);
            } catch (e) { 
                console.error("DashboardPage: Failed to parse user data from localStorage", e); 
            }
        }
    }

    if (dataToUse) {
        setCurrentUser({
          name: dataToUse.firstName ? `${dataToUse.firstName} ${dataToUse.lastName || ''}`.trim() : (dataToUse.username || 'User'),
          role: dataToUse.role_display || dataToUse.role || 'Member', // Use role_display if available
          avatarUrl: dataToUse.avatarUrl || '', // Assuming avatarUrl might come from user data
          allocatedWarehouseName: dataToUse.allocatedWarehouse ? dataToUse.allocatedWarehouse.name : (dataToUse.assignedWarehouses && dataToUse.assignedWarehouses.length > 0 ? dataToUse.assignedWarehouses[0].name : ''),
        });
    }
  }, [currentUserData]); // Depend on currentUserData prop

  // Close mobile sidebar on navigation
  useEffect(() => { 
    if (sidebarOpen && window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out 
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:static md:z-auto md:translate-x-0 md:flex-shrink-0 w-64`} 
      >
        <Sidebar 
            onLogout={onLogout} 
            closeMobileSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
      )}
      
      <div 
        className="flex-1 flex flex-col overflow-hidden bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: "url('/back2.png')" }} // Ensure back2.png is in your public folder
      >
        <div className="relative z-10 flex flex-col h-full">
            <header className="bg-white shadow-sm h-24 z-10 border-b border-gray-200 flex-shrink-0">
              <div className="container mx-auto px-6 h-full flex items-center justify-between">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="md:hidden text-gray-700 focus:outline-none mr-4 p-2 rounded-md hover:bg-gray-200"
                        aria-label="Open sidebar">
                  <FiMenu size={28} />
                </button>
                <div className="flex-1 md:ml-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">WMS Dashboard</h1>
                  <p className="text-sm sm:text-base text-gray-500">Optimize with Intelligence</p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : ( <BsPersonCircle className="w-full h-full text-gray-400 p-1" /> )}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800 truncate" title={currentUser.name}>{currentUser.name}</p>
                    <p className="text-sm text-gray-500 truncate" title={currentUser.role}>
                      {currentUser.role} {currentUser.allocatedWarehouseName && `(${currentUser.allocatedWarehouseName})`}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            <main 
              className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6" 
            >
              <Outlet /> 
            </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;