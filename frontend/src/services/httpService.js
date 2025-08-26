import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class HttpService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.tokenCallback = null;
    this.setupInterceptors();
  }

  setTokenCallback(callback) {
    this.tokenCallback = callback;
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        if (this.tokenCallback) {
          try {
            const token = await this.tokenCallback();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Error getting access token:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('Unauthorized request - token may be expired');
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(url, data, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch(url, data, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          'Error del servidor';
      
      return new Error(`${error.response.status}: ${errorMessage}`);
    } else if (error.request) {
      return new Error('Error de conexión - No se pudo contactar el servidor');
    } else {
      return new Error('Error inesperado');
    }
  }
}

const httpService = new HttpService();
export default httpService;
