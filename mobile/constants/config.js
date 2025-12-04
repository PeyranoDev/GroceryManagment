import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Production API URL (Azure Container Apps)
const PRODUCTION_API_URL = 'https://grocery-manager-api.gentlepebble-e9d83181.brazilsouth.azurecontainerapps.io';

// Set to true to use production API, false for local development
const USE_PRODUCTION = true;

// Get API URL based on environment and platform
const getApiUrl = () => {
    // Check for environment variables first
    const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
    if (envApiUrl) {
        return envApiUrl;
    }

    // Use production API if enabled
    if (USE_PRODUCTION) {
        return PRODUCTION_API_URL;
    }

    // Local development URLs
    if (Platform.OS === 'android') {
        // Android emulator uses 10.0.2.2 to access host machine
        return 'http://10.0.2.2:5001';
    } else if (Platform.OS === 'ios') {
        // iOS simulator can use localhost
        return 'http://localhost:5001';
    }

    // Default fallback
    return 'http://localhost:5001';
};

const normalizeApiUrl = (url) => {
    if (!url || typeof url !== 'string') return `${PRODUCTION_API_URL}/api`;
    const trimmed = url.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const config = {
    API_BASE_URL: normalizeApiUrl(getApiUrl()),
    PRODUCTION_API_URL,
    USE_PRODUCTION,
    DEFAULT_GROCERY_ID: '1',
    REQUEST_TIMEOUT: 30000,
};

// Debug log for API URL (remove in production build)
console.log('📡 API URL:', config.API_BASE_URL);
