#!/bin/sh
set -eu

# Default API URL - will be overridden by Azure Container App environment variable
: "${API_URL:=http://localhost:5001}"

# Generate env.js with runtime environment variables
cat > /app/dist/env.js << EOF
window.__APP_ENV__ = {
  API_URL: "${API_URL}"
};
EOF

echo "Environment configured with API_URL: ${API_URL}"

exec "$@"
