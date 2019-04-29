#!/bin/bash

set -euox pipefail

# Check if the specified dh file is both valid and exists, otherwise create it.
printf "Checking for dhparam. This may produce an error. You can ignore it.\\n"
if ! openssl dhparam -check -in "${NGINX_DH_PARAM}" ;
then
  printf "Did not find dh file.\\generating dhparam 2048 at %s\\n" "${NGINX_DH_PARAM}"
  openssl dhparam -out "${NGINX_DH_PARAM}" 2048
else
  printf "dh key found...continuing \\n"
fi

# Create the log files for NGINX. It won't start if these don't exist.
printf "Checking for nginx log files"
touch "${NGINX_LOG_DIR}/${NGINX_LOG_ACCESS}"
touch "${NGINX_LOG_DIR}/${NGINX_LOG_ERROR}"

if [[ "${USE_LETS_ENCRYPT}" == "true" ]];
then
  certbot certonly --standalone -d "$LETS_ENCRYPT_DOMAIN" --agree-tos -m \
  "$LETS_ENCRYPT_EMAIL" --no-eff-email --non-interactive --keep \
  --preferred-challenges http
  NGINX_SERVER_HOST="$LETS_ENCRYPT_DOMAIN"
  NGINX_SSL_CERT_PATH="/etc/letsencrypt/live/$LETS_ENCRYPT_DOMAIN/fullchain.pem"
  NGINX_SSL_KEY_PATH="/etc/letsencrypt/live/$LETS_ENCRYPT_DOMAIN/privkey.pem"


# Here we generate new self signed certs. We only want to generate if:
# USE_LETS_ENCRYPT is true AND we haven't already generated certificates
# furthermore, we want to generate if the force flag is set to true
else
  # Not using Lets Encrypt, thus generate certs, etc
  printf "Not using lets encrypt. \\nFinding or generating certificates\\n."
  # If either of the certs don't exist, generate.
  # Also force generate if flag is enabled.
  if [[ ( ! -f "$NGINX_SSL_CERT_PATH" ||  ! -f "$NGINX_SSL_KEY_PATH" ) \
    ||  "$NGINX_GENERATE_SSL_CERT_FORCE" == "true" ]];
  then
    # Return to current dir after cert generation
    CURRENT_DIR=$(pwd)
    export NGINX_SERVER_HOST=${localhost:-NGINX_SERVER_HOST}
    printf "Generating SSL Cert\\nHostname: %s\\n" "$NGINX_SERVER_HOST"
    cd "/certs"
    # Create certificates
    openssl req -subj "/CN=${NGINX_SERVER_HOST}" -x509 -newkey rsa:4096 -nodes \
    -keyout key.pem -out cert.pem -days 365
    cd "${CURRENT_DIR}"
  fi
fi

# Search each of these directories for .template files and perform
# substitution
/sub.sh "/etc/nginx/conf.d"

exec "$@"
