#!/bin/sh
set -eu

: "${API_URL:=http://localhost:8080}"
: "${API_ORIGIN:=}" 

if [ -f /usr/share/nginx/html/env.template.js ]; then
  export API_URL
  envsubst '${API_URL}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

# Nginx default.conf desde template
if [ -f /etc/nginx/conf.d/default.conf.template ]; then
  export API_ORIGIN
  envsubst '${API_ORIGIN}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
fi

exec "$@"
