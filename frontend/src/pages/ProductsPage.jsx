// D:\WMS\frontend\src\pages\ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
// Removed Swal import as error display is primarily inline or handled by fetch error
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("ProductsPage fetch error:", err);
        const errorMessage = err.detail || (typeof err === 'string' ? err : 'Failed to load products.');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) { 
    return (
        <div className="flex justify-center items-center h-64 p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          <p className="ml-3 text-slate-700 dark:text-slate-300">Loading products...</p>
        </div>
      );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-3 border-slate-300 dark:border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100">Manage Products</h2>
        <Link 
          to="/dashboard/products/new" 
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Product
        </Link>
      </div>
      
      {error && products.length === 0 && (
        <div className="text-center text-red-600 dark:text-red-400 p-4 mb-4 bg-red-100 dark:bg-red-900/30 rounded-md border border-red-300 dark:border-red-700">
          Could not load product data: {error}
        </div>
      )}

      {!isLoading && products.length === 0 && !error && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new product.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="py-3 px-6">EAN No.</th>
                <th scope="col" className="py-3 px-6">Name / Material Desc.</th>
                <th scope="col" className="py-3 px-6">Brand</th>
                <th scope="col" className="py-3 px-6">Category</th> {/* Changed header from "Category Type" to "Category" for UI */}
                <th scope="col" className="py-3 px-6 text-right">MRP</th>
                <th scope="col" className="py-3 px-6 text-center">Min Qty</th>
                <th scope="col" className="py-3 px-6 text-center">Active</th>
                <th scope="col" className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ean_no || product.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors duration-150">
                  <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {product.ean_no}
                  </td>
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6">{product.brand_display || <span className="text-slate-400 italic">N/A</span>}</td>
                  <td className="py-4 px-6">{product.category_type_display || <span className="text-slate-400 italic">N/A</span>}</td> {/* Using category_type_display */}
                  <td className="py-4 px-6 text-right">
                    {product.mrp !== null && product.mrp !== undefined ? parseFloat(product.mrp).toFixed(2) : <span className="text-slate-400 italic">N/A</span>}
                  </td>
                  <td className="py-4 px-6 text-center">{product.min_quantity}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200 border border-green-300 dark:border-green-600' 
                        : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200 border border-red-300 dark:border-red-600'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center space-x-2">
                    {/* Future Action Buttons */}
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

export default ProductsPage;