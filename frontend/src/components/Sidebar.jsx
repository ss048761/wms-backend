// D:\WMS\frontend\src\components\Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Import icons (ensure these match your sidebarNavItems)
import {
  MdDashboard, MdOutlineInventory2, MdTrendingUp, MdLogout,
  MdOutlinePublishedWithChanges, MdCategory // Added MdCategory for Products
} from 'react-icons/md';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { FiPackage, FiSettings } from 'react-icons/fi';
import { BsBoxArrowUp } from 'react-icons/bs';
import { FaBoxes, FaArchive, FaShoppingCart } from 'react-icons/fa'; // Added FaShoppingCart for Products
import { TbTruckDelivery, TbTruck } from 'react-icons/tb';

const SidebarItem = ({ icon: Icon, name, route, isActive, onClick }) => (
  <Link
    to={route}
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ease-in-out group
              ${isActive
                ? 'bg-blue-600 text-white shadow-md transform -translate-x-px'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
  >
    <Icon className={`w-6 h-6 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-500 group-hover:text-blue-600'}`} />
    {name}
  </Link>
);

const Sidebar = ({ onLogout, closeMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarNavItems = [
    { name: 'Overview', icon: MdDashboard, route: '/dashboard/overview' },
    { name: 'Warehouses', icon: FiPackage, route: '/dashboard/warehouses' },
    { name: 'Products', icon: FaShoppingCart, route: '/dashboard/products' }, // <-- ADDED PRODUCTS LINK
    { name: 'Goods Receiving', icon: TbTruckDelivery, route: '/dashboard/receiving' },
    { name: 'Putaway', icon: FaBoxes, route: '/dashboard/putaway' },
    { name: 'Orders', icon: HiOutlineClipboardList, route: '/dashboard/orders' },
    { name: 'Picking', icon: BsBoxArrowUp, route: '/dashboard/picking' },
    { name: 'Packing', icon: FaArchive, route: '/dashboard/packing' },
    { name: 'Dispatch', icon: TbTruck, route: '/dashboard/dispatch' },
    { name: 'Inventory', icon: MdOutlineInventory2, route: '/dashboard/inventory' },
    { name: 'Cycle Count', icon: MdOutlinePublishedWithChanges, route: '/dashboard/cycle-count' },
    { name: 'Forecasts', icon: MdTrendingUp, route: '/dashboard/forecasts' },
    { name: 'Settings', icon: FiSettings, route: '/dashboard/settings' },
  ];

  const handleItemClick = () => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  const handleLogoutClick = () => {
    if (typeof onLogout === 'function') {
        onLogout();
    } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        navigate('/login');
    }
    if (typeof closeMobileSidebar === 'function') {
        closeMobileSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-700 border-r border-gray-200">
      <div className="flex items-center justify-start px-6 h-24 border-b border-gray-200 flex-shrink-0">
        <img src="/header.png" alt="Company Logo" className="h-12 w-auto" />
      </div>
      <nav className="mt-6 px-3 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
        {sidebarNavItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            name={item.name}
            route={item.route}
            isActive={location.pathname === item.route || 
                      (item.route !== '/dashboard/overview' && item.route !== '#' && location.pathname.startsWith(item.route))} // Adjusted active check slightly for overview
            onClick={handleItemClick}
          />
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={handleLogoutClick}
          className="w-full group flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg 
                     bg-red-500 hover:bg-red-600 
                     text-white focus:outline-none focus:ring-2 focus:ring-red-500 
                     focus:ring-offset-2 focus:ring-offset-white transition-colors duration-150"
        >
          <MdLogout className="w-6 h-6 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;