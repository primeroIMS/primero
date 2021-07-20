#! /bin/sh

set -ex
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

# generate a self signed certificate for development mode
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

if [ "$1" = "nginx" ]; then
	
	prim_generate_dh

	printf "Use LetsEncrypt status %s\\nh" "$USE_LETS_ENCRYPT"

	if [ "$USE_LETS_ENCRYPT" == "false" ] && [ "$USE_EXTERNAL_CERTS" == "false" ] ;
	then
      	prim_generate_self_signed_certs
	fi

    update-nginx-conf.sh
fi

exec "${@}"
