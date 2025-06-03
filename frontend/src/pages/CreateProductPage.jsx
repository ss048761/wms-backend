// D:\WMS\frontend\src\pages\CreateProductPage.jsx
import React, { useState /* Removed: useEffect */ } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productService';
// REMOVED: import { getProductCategories } from '../services/productCategoryService';
import Swal from 'sweetalert2';

const brandOptions = [
  { key: '', label: '-- Select Brand --' },
  { key: 'MAMAEARTH', label: 'Mamaearth' },
  { key: 'BBLUNT', label: 'B-Blunt' },
  { key: 'TDC', label: 'TDC (The Derma Co.)' },
  { key: 'AYUGA', label: 'Ayuga' },
  { key: 'AQUALOGICA', label: 'Aqualogica' },
  { key: 'PUREORIGIN', label: 'Pure Origin' },
  { key: 'OTHER', label: 'Other' },
];

const categoryTypeOptions = [
  { key: '', label: '-- Select Category --' },
  { key: 'BABY', label: 'Baby' },
  { key: 'HAIR', label: 'Hair' },
  { key: 'SKIN', label: 'Skin' },
  { key: 'PH1', label: 'Placeholder 1' },
  { key: 'PH2', label: 'Placeholder 2' },
  { key: 'PH3', label: 'Placeholder 3' },
  { key: 'OTHER', label: 'Other Category' },
];

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    category_type: '', // Changed from category (ID) to category_type (choice key)
    unit_of_measure: 'PCS',
    weight: '',
    volume: '',
    is_active: true,
    ean_no: '',
    material_code: '',
    mrp: '',
    min_quantity: '0',
    max_quantity: '',
    brand: '',
    // sku, description are optional and not on this form
  });
  // REMOVED: const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // REMOVED: useEffect for fetching categories

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value, }));
    if (formErrors[name]) { setFormErrors(prevErrors => ({ ...prevErrors, [name]: null })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    const dataToSubmit = {
      ean_no: productData.ean_no,
      name: productData.name,
      material_code: productData.material_code || null,
      category_type: productData.category_type === '' ? null : productData.category_type, // Use category_type
      brand: productData.brand === '' ? null : productData.brand,
      mrp: productData.mrp === '' ? null : parseFloat(productData.mrp),
      min_quantity: productData.min_quantity === '' ? 0 : parseInt(productData.min_quantity, 10),
      max_quantity: productData.max_quantity === '' ? null : parseInt(productData.max_quantity, 10),
      unit_of_measure: productData.unit_of_measure,
      weight: productData.weight === '' ? null : parseFloat(productData.weight),
      volume: productData.volume === '' ? null : parseFloat(productData.volume),
      is_active: productData.is_active,
      // Optional: send sku and description if you want to allow them, or let backend default them if model allows
      // sku: productData.sku || null, 
      // description: productData.description || null, 
    };
    
    if (!dataToSubmit.ean_no) { Swal.fire('Validation Error', 'EAN No. is required.', 'error'); setIsLoading(false); setFormErrors(prev => ({...prev, ean_no: "EAN No. is required."})); return; }
    if (!dataToSubmit.name) { Swal.fire('Validation Error', 'Product Name / Material Description is required.', 'error'); setIsLoading(false); setFormErrors(prev => ({...prev, name: "Product Name is required."})); return; }
    if (!dataToSubmit.category_type) { Swal.fire('Validation Error', 'Please select a product category.', 'error'); setIsLoading(false); setFormErrors(prev => ({...prev, category_type: "Category is required."})); return; }

    try {
      const newProduct = await createProduct(dataToSubmit);
      setIsLoading(false);
      Swal.fire({ icon: 'success', title: 'Product Created!', text: `Product "${newProduct.name}" (EAN: ${newProduct.ean_no}) has been created.`, timer: 3000, showConfirmButton: false });
      navigate('/dashboard/products');
    } catch (error) {
      setIsLoading(false); console.error('Failed to create product:', error);
      if (typeof error === 'object' && error !== null && !Array.isArray(error)) { setFormErrors(error); Swal.fire('Creation Failed', 'Please check the form for errors.', 'error');
      } else { Swal.fire('Creation Failed', String(error.detail || error.message || 'An unexpected error occurred.'), 'error'); }
    }
  };
  
  const commonInputClass = "w-full px-4 py-2.5 bg-white dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-200 ease-in-out placeholder-slate-400 dark:placeholder-slate-500";
  const errorTextClass = "text-red-500 text-xs mt-1";

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-xl p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-6 border-b pb-3 border-slate-300 dark:border-slate-700">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* EAN No. and Product Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ean_no" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">EAN No. <span className="text-red-500">*</span></label>
            <input type="text" name="ean_no" id="ean_no" value={productData.ean_no} onChange={handleChange} required className={commonInputClass} placeholder="e.g., 1234567890123"/>
            {formErrors.ean_no && <p className={errorTextClass}>{typeof formErrors.ean_no === 'string' ? formErrors.ean_no : formErrors.ean_no.join(', ')}</p>}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name / Material Description <span className="text-red-500">*</span></label>
            <input type="text" name="name" id="name" value={productData.name} onChange={handleChange} required className={commonInputClass} placeholder="Full product name"/>
            {formErrors.name && <p className={errorTextClass}>{typeof formErrors.name === 'string' ? formErrors.name : formErrors.name.join(', ')}</p>}
          </div>
        </div>

        {/* Material Code and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="material_code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Material Code</label>
            <input type="text" name="material_code" id="material_code" value={productData.material_code} onChange={handleChange} className={commonInputClass} placeholder="Internal material identifier"/>
            {formErrors.material_code && <p className={errorTextClass}>{typeof formErrors.material_code === 'string' ? formErrors.material_code : formErrors.material_code.join(', ')}</p>}
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
            <select name="brand" id="brand" value={productData.brand} onChange={handleChange} className={commonInputClass}>
              {brandOptions.map(brand => ( <option key={brand.key} value={brand.key}>{brand.label}</option> ))}
            </select>
            {formErrors.brand && <p className={errorTextClass}>{typeof formErrors.brand === 'string' ? formErrors.brand : formErrors.brand.join(', ')}</p>}
          </div>
        </div>
        
        {/* Category (UPDATED) and Unit of Measure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category_type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category <span className="text-red-500">*</span></label>
            <select name="category_type" id="category_type" value={productData.category_type} onChange={handleChange} required className={commonInputClass}>
              {categoryTypeOptions.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
            {formErrors.category_type && <p className={errorTextClass}>{typeof formErrors.category_type === 'string' ? formErrors.category_type : formErrors.category_type.join(', ')}</p>}
          </div>
          <div>
            <label htmlFor="unit_of_measure" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit of Measure</label>
            <input type="text" name="unit_of_measure" id="unit_of_measure" value={productData.unit_of_measure} onChange={handleChange} className={commonInputClass} placeholder="e.g., PCS, KG, BOX"/>
            {formErrors.unit_of_measure && <p className={errorTextClass}>{typeof formErrors.unit_of_measure === 'string' ? formErrors.unit_of_measure : formErrors.unit_of_measure.join(', ')}</p>}
          </div>
        </div>
        
        {/* MRP, Min Qty, Max Qty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="mrp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">MRP</label>
            <input type="number" name="mrp" id="mrp" value={productData.mrp} onChange={handleChange} step="0.01" min="0" className={commonInputClass} placeholder="e.g., 199.99"/>
            {formErrors.mrp && <p className={errorTextClass}>{typeof formErrors.mrp === 'string' ? formErrors.mrp : formErrors.mrp.join(', ')}</p>}
          </div>
          <div>
            <label htmlFor="min_quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Quantity</label>
            <input type="number" name="min_quantity" id="min_quantity" value={productData.min_quantity} onChange={handleChange} step="1" min="0" className={commonInputClass} placeholder="e.g., 0 or 10"/>
            {formErrors.min_quantity && <p className={errorTextClass}>{typeof formErrors.min_quantity === 'string' ? formErrors.min_quantity : formErrors.min_quantity.join(', ')}</p>}
          </div>
          <div>
            <label htmlFor="max_quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Quantity</label>
            <input type="number" name="max_quantity" id="max_quantity" value={productData.max_quantity} onChange={handleChange} step="1" min="0" className={commonInputClass} placeholder="e.g., 1000 (Optional)"/>
            {formErrors.max_quantity && <p className={errorTextClass}>{typeof formErrors.max_quantity === 'string' ? formErrors.max_quantity : formErrors.max_quantity.join(', ')}</p>}
          </div>
        </div>
        
        {/* Weight and Volume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
                <input type="number" name="weight" id="weight" value={productData.weight} onChange={handleChange} step="0.01" min="0" className={commonInputClass} placeholder="e.g., 1.25"/>
                {formErrors.weight && <p className={errorTextClass}>{typeof formErrors.weight === 'string' ? formErrors.weight : formErrors.weight.join(', ')}</p>}
            </div>
            <div>
                <label htmlFor="volume" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Volume (cbm)</label>
                <input type="number" name="volume" id="volume" value={productData.volume} onChange={handleChange} step="0.001" min="0" className={commonInputClass} placeholder="e.g., 0.05"/>
                {formErrors.volume && <p className={errorTextClass}>{typeof formErrors.volume === 'string' ? formErrors.volume : formErrors.volume.join(', ')}</p>}
            </div>
        </div>

        {/* Is Active */}
        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_active" id="is_active" checked={productData.is_active} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 dark:border-slate-600 rounded focus:ring-sky-500"/>
          <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Product is Active</label>
        </div>
        {formErrors.is_active && <p className={errorTextClass}>{typeof formErrors.is_active === 'string' ? formErrors.is_active : formErrors.is_active.join(', ')}</p>}

        {(formErrors.non_field_errors || (typeof formErrors === 'string' && formErrors && !Object.keys(productData).includes(formErrors))) && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline"> {formErrors.non_field_errors ? (formErrors.non_field_errors.join ? formErrors.non_field_errors.join(', ') : formErrors.non_field_errors) : formErrors}</span>
          </div>
        )}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-8">
          <button type="button" onClick={() => navigate('/dashboard/products')} disabled={isLoading} className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition duration-150">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50">{isLoading ? 'Creating...' : 'Create Product'}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;