// D:\WMS\frontend\src\services\warehouseService.js
import apiClient from './api';

export const getWarehouses = async () => {
  try {
    const response = await apiClient.get('/wms/warehouses/'); // Path relative to API_BASE_URL in api.js
    return response.data;
  } catch (error) {
    console.error('Error fetching warehouses:', error.response || error.message);
    throw error.response ? error.response.data : new Error('Network error or no response fetching warehouses');
  }
};

// Future functions:
// export const getWarehouseByCode = async (code) => { ... apiClient.get(`/wms/warehouses/${code}/`) ... };
// export const createWarehouse = async (warehouseData) => { ... apiClient.post('/wms/warehouses/', warehouseData) ... };
// export const updateWarehouse = async (code, warehouseData) => { ... apiClient.put(`/wms/warehouses/${code}/`, warehouseData) ... };
// export const deleteWarehouse = async (code) => { ... apiClient.delete(`/wms/warehouses/${code}/`) ... };