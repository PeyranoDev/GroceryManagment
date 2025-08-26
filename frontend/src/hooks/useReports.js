import { useState } from 'react';
import { reportsAPI } from '../services/api';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFilteredReports = async (filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportsAPI.getFilteredReports(filters);
      const items = response.data || response;
      setReports(Array.isArray(items) ? items : []);
      return items;
    } catch (err) {
      console.error('Error fetching filtered reports:', err);
      setError(err.message);
      setReports([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSalesSummary = async () => {
    try {
      const response = await reportsAPI.getSalesSummary();
      return response.data || response;
    } catch (err) {
      console.error('Error getting sales summary:', err);
      throw err;
    }
  };

  const getTotalSales = async (startDate, endDate) => {
    try {
      const response = await reportsAPI.getTotalSales(startDate, endDate);
      return response.data || response;
    } catch (err) {
      console.error('Error getting total sales:', err);
      throw err;
    }
  };

  const getTotalPurchases = async (startDate, endDate) => {
    try {
      const response = await reportsAPI.getTotalPurchases(startDate, endDate);
      return response.data || response;
    } catch (err) {
      console.error('Error getting total purchases:', err);
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    getFilteredReports,
    getSalesSummary,
    getTotalSales,
    getTotalPurchases
  };
};
