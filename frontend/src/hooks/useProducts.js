import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getAll();
      const items = response.data || response;
      setProducts(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await productsAPI.create(productData);
      const newProduct = response.data || response;
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productsAPI.update(id, productData);
      const updatedProduct = response.data || response;
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const searchProducts = (searchTerm) => {
    if (!searchTerm.trim()) return [];
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refresh: fetchProducts
  };
};
