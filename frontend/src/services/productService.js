// D:\WMS\frontend\src\services\productService.js
import apiClient from './api';

export const getProducts = async () => {
  try {
    const response = await apiClient.get('/wms/products/');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response || error.message);
    throw error.response ? error.response.data : new Error('Network error or no response fetching products');
  }
};

// --- NEW: Function to create a product ---
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/wms/products/', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response || error.message);
    // Throw a more structured error for the component to handle
    // error.response.data might contain validation errors from Django
    throw error.response ? error.response.data : new Error('Network error or server issue creating product');
  }
};

// Future functions:
// export const getProductBySku = async (sku) => { ... };
// export const updateProduct = async (sku, productData) => { ... };
// export const deleteProduct = async (sku) => { ... };