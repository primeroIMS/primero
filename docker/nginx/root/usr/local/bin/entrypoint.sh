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

if [ "$1" = "nginx" ]; then
	prim_generate_dh
    update-nginx-conf.sh
fi

exec "${@}"
