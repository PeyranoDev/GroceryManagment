import { useState, useEffect } from 'react';
import { dashboardAPI, productsAPI, inventoryAPI } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    products: 'checking',
    inventory: 'checking',
    dashboard: 'checking'
  });

  useEffect(() => {
    const testConnections = async () => {
      try {
        await fetch('http://localhost:5000/api');
        setStatus(prev => ({ ...prev, backend: 'success' }));
      } catch (error) {
        setStatus(prev => ({ ...prev, backend: 'error' }));
      }

      try {
        await productsAPI.getAll();
        setStatus(prev => ({ ...prev, products: 'success' }));
      } catch (error) {
        setStatus(prev => ({ ...prev, products: 'error' }));
      }

      try {
        await inventoryAPI.getAll();
        setStatus(prev => ({ ...prev, inventory: 'success' }));
      } catch (error) {
        setStatus(prev => ({ ...prev, inventory: 'error' }));
      }

      try {
        await dashboardAPI.getStats();
        setStatus(prev => ({ ...prev, dashboard: 'success' }));
      } catch (error) {
        setStatus(prev => ({ ...prev, dashboard: 'error' }));
      }
    };

    testConnections();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checking': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      backgroundColor: 'var(--color-bg-dark)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      border: '1px solid var(--color-border-light)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔌 Backend Connection Status</div>
      <div>{getStatusIcon(status.backend)} Backend Server</div>
      <div>{getStatusIcon(status.products)} Products API</div>
      <div>{getStatusIcon(status.inventory)} Inventory API</div>
      <div>{getStatusIcon(status.dashboard)} Dashboard API</div>
      <div style={{ fontSize: '10px', marginTop: '8px', color: 'var(--color-text-muted)' }}>
        {Object.values(status).every(s => s === 'success') 
          ? '🎉 All connections working!' 
          : Object.values(status).some(s => s === 'error')
          ? '⚠️ Check backend server'
          : '⏳ Testing connections...'}
      </div>
    </div>
  );
};

export default ConnectionTest;
