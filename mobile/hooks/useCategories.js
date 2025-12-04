import { useState, useCallback } from 'react';
import { categoriesAPI } from '../services/api';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('📂 Fetching categories...');
            const response = await categoriesAPI.getAll();
            // Handle API response structure
            const data = response.data?.data || response.data || response;
            const items = Array.isArray(data) ? data : [];
            console.log(`✅ Loaded ${items.length} categories`);
            setCategories(items);
        } catch (err) {
            console.error('❌ Error fetching categories:', err);
            setError(err.message || 'Error al cargar las categorías');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCategory = useCallback(async (categoryData) => {
        try {
            setLoading(true);
            console.log('📂 Creating category...');
            
            const response = await categoriesAPI.create(categoryData);
            const newCategory = response.data?.data || response.data || response;

            setCategories(prev => [newCategory, ...prev]);
            console.log('✅ Category created successfully');
            return newCategory;
        } catch (err) {
            console.error('❌ Error creating category:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCategoryById = useCallback(async (id) => {
        try {
            console.log(`📂 Fetching category ${id}...`);
            const response = await categoriesAPI.getById(id);
            return response.data?.data || response.data || response;
        } catch (err) {
            console.error('❌ Error getting category by id:', err);
            throw err;
        }
    }, []);

    const updateCategory = useCallback(async (id, data) => {
        try {
            console.log(`📂 Updating category ${id}...`);
            const response = await categoriesAPI.update(id, data);
            const updated = response.data?.data || response.data || response;
            
            setCategories(prev => prev.map(category => 
                category.id === id ? { ...category, ...updated } : category
            ));
            
            console.log('✅ Category updated');
            return updated;
        } catch (err) {
            console.error('❌ Error updating category:', err);
            throw err;
        }
    }, []);

    const deleteCategory = useCallback(async (id) => {
        try {
            console.log(`📂 Deleting category ${id}...`);
            await categoriesAPI.delete(id);
            setCategories(prev => prev.filter(category => category.id !== id));
            console.log('✅ Category deleted');
        } catch (err) {
            console.error('❌ Error deleting category:', err);
            throw err;
        }
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        getCategoryById,
        updateCategory,
        deleteCategory,
        refresh: fetchCategories,
    };
};
