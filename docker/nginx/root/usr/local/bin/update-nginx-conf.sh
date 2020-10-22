#! /bin/sh
# shellcheck disable=SC2039
#
# NOTE: `local` is not (yet) in POSIX but is well supported, particularly by
# dash.
#
# NOTE: For certbot we need to alter the nginx configuration based on whether there are the required SSL certificate files
# or not.  So this is why # @begin-ssl and # @end-ssl are used.  If the SSL certificate files don't exist then it deletes
# every line between a pair of @begin-ssl and @end-ssl, using sed.  If the SSL certificate files do exist then the SSL
# setting from the nginx conf will be used.  This script will also use sed to replace all environment variables using
# the config_subst function.  The other two functions will either write out the section between the # @begin-ssl and # @end-ssl
# marker, config_write, or remove the section and the markers, config_prune.

set -ex

require () {
    local var="${1}"
    eval local val="\${${var}}"
    local var_file="${var}_FILE"
    eval local val_file="\${${var_file}}"
    # shellcheck disable=SC2154
    if [ -n "${val}" ] && [ -n "${val_file}" ]; then
        echo 2>&1 "error: both ${var} and ${var_file} are set (but are exclusive)"
        exit 1
    elif [ -n "${val_file}" ]; then
        local val
        val="$(cat "${val_file}")"
        export "${var}"="${val}"
        unset "${var_file}"
    elif [ -z "${val}" ]; then
        echo 2>&1 "error: neither ${var} nor ${var_file} are set"
        exit 1
    fi
}

config_prune () {
    local begin="${1}"
    local end="${2}"
    SED_ARGS="${SED_ARGS} -e \"/${begin}/,/${end}/d\""
}

config_write () {
    local begin="${1}"
    local end="${2}"
    SED_ARGS="${SED_ARGS} -e \"/${begin}/d\""
    SED_ARGS="${SED_ARGS} -e \"/${end}/d\""
}

config_subst () {
    local var="${1}"
    eval local val="\${${var}}"
    SED_ARGS="${SED_ARGS} -e \"s#\\\${${var}}#${val}#g\""
}

SED_ARGS=""

require 'NGINX_CURRENT_PATH'
require 'NGINX_HTTP_PORT'
require 'NGINX_SERVER_NAME'
require 'NGINX_HTTPS_PORT'
require 'NGINX_DH_PARAM'
require 'NGINX_CLIENT_MAX_BODY_SIZE'
require 'NGINX_CLIENT_BODY_BUFFER_SIZE'
require 'NGINX_PROXY_PASS_URL'
require 'PROXY_CONNECT_TIMEOUT'
require 'PROXY_SEND_TIMEOUT'
require 'PROXY_READ_TIMEOUT'
require 'NGINX_SSL_CERT_PATH'
require 'NGINX_SSL_KEY_PATH'
config_subst 'NGINX_CURRENT_PATH'
config_subst 'NGINX_HTTP_PORT'
config_subst 'NGINX_SERVER_NAME'
config_subst 'NGINX_HTTPS_PORT'
config_subst 'NGINX_DH_PARAM'
config_subst 'NGINX_CLIENT_MAX_BODY_SIZE'
config_subst 'NGINX_CLIENT_BODY_BUFFER_SIZE'
config_subst 'NGINX_PROXY_PASS_URL'
config_subst 'PROXY_CONNECT_TIMEOUT'
config_subst 'PROXY_SEND_TIMEOUT'
config_subst 'PROXY_READ_TIMEOUT'
config_subst 'NGINX_SSL_CERT_PATH'
config_subst 'NGINX_SSL_KEY_PATH'

if [ -z "${NGINX_CERTIFICATE_NAME}" ] || [ ! -s "${NGINX_SSL_CERT_PATH}" ] || [ ! -s "${NGINX_SSL_KEY_PATH}" ]; then
    config_write '@begin-no-ssl' '@end-no-ssl'
    config_prune '@begin-ssl' '@end-ssl'
else
    config_prune '@begin-no-ssl' '@end-no-ssl'
    config_write '@begin-ssl' '@end-ssl'
fi

eval sed ${SED_ARGS} \
    < /etc/nginx/conf.d/primero.conf.template \
    > /etc/nginx/conf.d/primero.conf
