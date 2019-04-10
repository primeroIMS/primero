#!/bin/bash

NGINX_PID=$(/run/nginx.pid)

printf "Running certbot renewal. Date: %s\\n" "$(date)"

certbot renew

if [[ "$NGINX_PID" != 1 ]];
then
  printf "Error: NGINX not running as PID 1.\\nCurrent PID: %s" "$NGINX_PID"
fi

printf "Reloading NGINX configuration.\\n"
kill -s HUP "$NGINX_PID"
