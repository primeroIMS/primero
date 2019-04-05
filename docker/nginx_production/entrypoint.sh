#!/bin/bash

set -ex

# if [ "${NGINX_GENERATE_SSL_CERT}" == true ] && [ "${USE_IMPORTED_CERTS}" == true ];
# then
#   printf "Cannot use imported and generate"
#   exit 1
# fi

# If we need to generate ssl certificates then set the nginx paths corretly
# all certs are going to be stored in /certs which is defined as a volume
if [ "${NGINX_GENERATE_SSL_CERT}" == "true" ];
then
  CURRENT_DIR=$(pwd)
  export NGINX_SSL_CERT_PATH=/certs/cert.pem
  export NGINX_SSL_KEY_PATH=/certs/key.pem
  export NGINX_SERVER_HOST=${localhost:-NGINX_SERVER_HOST}
  printf "Generating SSL Cert\\nHostname: %s\\n" "$NGINX_SERVER_HOST"
  cd "/certs"
  openssl req -subj "/CN=${NGINX_SERVER_HOST}" -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
  cd "${CURRENT_DIR}"
fi

if [ "${USE_IMPORTED_CERTS}" == true ];
then
  printf "Not generating certificates. Using certificates at: \\n%s\\n%s\\n"  \
    "${NGINX_SSL_CERT_PATH}" "${NGINX_SSL_KEY_PATH}"
fi


# Search each of these directories for .template files and perform substitution
# If you want this to be done from environment, redefine TEMPLATE_DIRS not 
# TEMPLATE_DIRS_DEFAULT
TEMPLATE_DIRS_DEFAULT=( "/etc/nginx/conf.d" )
TEMPLATE_DIRS=( "${TEMPLATE_DIRS[@]:-"${TEMPLATE_DIRS_DEFAULT[@]}"}" )
for prim_filename in "${TEMPLATE_DIRS[@]}"/*.template
do
  # here we actually do the environment substitution
  /sub.sh "${prim_filename}"
done

exec "$@"
