import Constants from 'expo-constants';

// Get API URL from environment or use default
const getApiUrl = () => {
    // Check for environment variables
    const envApiUrl = Constants.expoConfig?.extra?.apiUrl;

    if (envApiUrl) {
        return envApiUrl;
    }

    // Default for development
    return 'http://localhost:5001';
};

const normalizeApiUrl = (url) => {
    if (!url || typeof url !== 'string') return 'http://localhost:5001/api';
    const trimmed = url.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const config = {
    API_BASE_URL: normalizeApiUrl(getApiUrl()),
    DEFAULT_GROCERY_ID: '1',
    REQUEST_TIMEOUT: 30000,
};
