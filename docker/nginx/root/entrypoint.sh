#!/bin/bash

set -euox pipefail

prim_generate_dh() {
  # Check if the specified dh file is both valid and exists, otherwise create it.
  printf "Checking for dhparam.\\n"
  if ! openssl dhparam -check -in "${NGINX_DH_PARAM}" 2> /dev/null;
  then
    printf "Did not find dh file.\\ngenerating dhparam 2048 at %s\\n" "${NGINX_DH_PARAM}"
    openssl dhparam -out "${NGINX_DH_PARAM}" 2048
  else
    printf "dh key found...continuing \\n"
  fi
  return 0
}

prim_nginx_create_logs() {
  # Create the log files for NGINX. It won't start if these don't exist.
  printf "Checking for nginx log files"
  touch "${NGINX_LOG_DIR}/${NGINX_LOG_ACCESS}"
  touch "${NGINX_LOG_DIR}/${NGINX_LOG_ERROR}"
  return 0
}

prim_certbot_generate_certs() {
  # if we use letsencrypt then let certbot create the certificates
  certbot certonly --standalone -d "$LETS_ENCRYPT_DOMAIN" --agree-tos -m "$LETS_ENCRYPT_EMAIL" --no-eff-email --non-interactive --keep --preferred-challenges http
  NGINX_SERVER_HOST="$LETS_ENCRYPT_DOMAIN"
  NGINX_SSL_CERT_PATH="/etc/letsencrypt/live/$LETS_ENCRYPT_DOMAIN/fullchain.pem"
  NGINX_SSL_KEY_PATH="/etc/letsencrypt/live/$LETS_ENCRYPT_DOMAIN/privkey.pem"
  return 0
}

prim_generate_self_signed_certs() {
  # Return to current dir after cert generation
  CURRENT_DIR=$(pwd)
  export NGINX_SERVER_HOST=${localhost:-NGINX_SERVER_HOST}
  printf "Generating SSL Cert\\nHostname: %s\\n" "$NGINX_SERVER_HOST"
  cd "/certs"
  # Create certificates
  openssl req -subj "/CN=${NGINX_SERVER_HOST}" -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
  cd "${CURRENT_DIR}"
  return 0
}

prim_nginx_start() {
  /sub.sh "/etc/nginx/conf.d"
  prim_nginx_create_logs
  prim_generate_dh

  if [ -z "$USE_LETS_ENCRYPT" ];
  then
    prim_certbot_generate_certs
  else
    prim_generate_self_signed_certs
  fi

  exec "$@"
}

prim_nginx_start "$@"


