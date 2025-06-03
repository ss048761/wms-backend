// D:\WMS\frontend\src\pages\WarehousesPage.jsx
import React, { useState, useEffect } from 'react';
import { getWarehouses } from '../services/warehouseService';
import Swal from 'sweetalert2';
// import { Link } from 'react-router-dom'; // For future "Add New" or "Edit" buttons

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Store error message string

  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWarehouses();
        setWarehouses(Array.isArray(data) ? data : []); // Ensure data is an array, even if API returns single object on error/empty
      } catch (err) {
        console.error("WarehousesPage fetch error:", err);
        // err might be an object with 'detail' or a string
        const errorMessage = err.detail || (typeof err === 'string' ? err : 'Failed to load warehouses. Please check console.');
        setError(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Warehouses',
          text: errorMessage,
          customClass: { popup: 'rounded-xl' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        <p className="ml-3 text-slate-700 dark:text-slate-300">Loading warehouses...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-3 border-slate-300 dark:border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100">
          Manage Warehouses
        </h2>
        {/* Future "Add New Warehouse" Button */}
        {/* <Link to="/dashboard/warehouses/new" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150">
          + Add Warehouse
        </Link> */}
      </div>
      
      {error && warehouses.length === 0 && (
        <div className="text-center text-red-600 dark:text-red-400 p-4 mb-4 bg-red-100 dark:bg-red-900/30 rounded-md border border-red-300 dark:border-red-700">
          Could not load warehouse data: {error}
        </div>
      )}

      {!isLoading && warehouses.length === 0 && !error && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-12V2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No warehouses</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new warehouse.</p>
        </div>
      )}

      {warehouses.length > 0 && (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="py-3 px-6">Code</th>
                <th scope="col" className="py-3 px-6">Name</th>
                <th scope="col" className="py-3 px-6 min-w-[250px]">Address</th>
                <th scope="col" className="py-3 px-6 text-center">Status</th>
                <th scope="col" className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.code} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors duration-150">
                  <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {warehouse.code}
                  </td>
                  <td className="py-4 px-6">{warehouse.name}</td>
                  <td className="py-4 px-6">{warehouse.address || <span className="text-slate-400 italic">N/A</span>}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      warehouse.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200 border border-green-300 dark:border-green-600' 
                        : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200 border border-red-300 dark:border-red-600'
                    }`}>
                      {warehouse.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center space-x-2">
                    {/* Future Action Buttons */}
                    {/* <button className="font-medium text-sky-600 dark:text-sky-500 hover:underline">Edit</button>
                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WarehousesPage;