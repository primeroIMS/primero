#!/bin/bash

set -euox pipefail

# check if the diffie hellman group exists, and is valid, otherwise create it
prim_generate_dh() {
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

# check if nginx logs exist and create them. nginx will not start without these.
prim_nginx_create_logs() {
  # Create the log files for NGINX. It won't start if these don't exist.
  printf "Checking for nginx log files"
  touch "${NGINX_LOG_DIR}/${NGINX_LOG_ACCESS}"
  touch "${NGINX_LOG_DIR}/${NGINX_LOG_ERROR}"
  return 0
}

# run certbot agent and define cert/key paths
prim_certbot_generate_certs() {
  NGINX_SERVER_HOST="$LETS_ENCRYPT_DOMAIN"
  NGINX_SSL_CERT_PATH="/etc/letsencrypt/live/$LETS_ENCRYPT_DOMAIN/fullchain.pem"
  NGINX_SSL_KEY_PATH="/etc/letsencrypt/live/$LETS_ENCRYPT_DOMAIN/privkey.pem"
  if [ -f $NGINX_SSL_KEY_PATH ];
  then
    printf "Let's Encrypt certificates already exist. Doing nothing.\\n"
  else
    # if we use letsencrypt then let certbot create the certificates
    certbot certonly --standalone -d "$LETS_ENCRYPT_DOMAIN" --agree-tos -m "$LETS_ENCRYPT_EMAIL" --no-eff-email --non-interactive --keep --preferred-challenges http
  fi
  return 0
}

# generate a self signed certificate for development mode
# TODO: check if certs exist and if they do use them instead
prim_generate_self_signed_certs() {
  # Return to current dir after cert generation
  if [ -f /certs/key.pem ];
  then
    printf "Self-signed certs are already generated. Doing nothing.\\n"
  else
  CURRENT_DIR=$(pwd)
    export NGINX_SERVER_HOST=${localhost:-NGINX_SERVER_HOST}
    printf "Generating SSL Cert\\nHostname: %s\\n" "$NGINX_SERVER_HOST"
    cd "/certs"
    # Create certificates
    openssl req -subj "/CN=${NGINX_SERVER_HOST}" -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
    cd "${CURRENT_DIR}"
  fi
  return 0
}

# the nginx container has a default site installed that we do not want
# thus, check if it exists and remove it
prim_remove_default_nginx_site() {
  NGINX_CONFD_DEFAULT_SITE_PATH="/etc/nginx/conf.d/default.conf"
  if [ -f "$NGINX_CONFD_DEFAULT_SITE_PATH" ];
  then
    rm -f "$NGINX_CONFD_DEFAULT_SITE_PATH"
  fi
}

# main control flow of the containter.
# performs setup and starts container
prim_nginx_start() {
  prim_nginx_create_logs
  prim_remove_default_nginx_site
  prim_generate_dh

  printf "Use LetsEncrypt status %s\\nh" "$USE_LETS_ENCRYPT"

  if [ "$USE_LETS_ENCRYPT" == "true" ];
  then
    prim_certbot_generate_certs
  else
    prim_generate_self_signed_certs
  fi

  # Note: this must come after the certificate generation
  /sub.sh "/etc/nginx/conf.d"
  exec "$@"
}

prim_nginx_start "$@"
