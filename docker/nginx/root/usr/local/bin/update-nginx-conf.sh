#! /bin/sh
# shellcheck disable=SC2039
#
# NOTE: `local` is not (yet) in POSIX but is well supported, particularly by
# dash.

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

require 'NGINX_SERVER_NAME'
config_subst 'NGINX_SERVER_NAME'

if [ -z "${NGINX_CERTIFICATE_NAME}" ] || [ ! -d "/etc/letsencrypt/live/${NGINX_CERTIFICATE_NAME}" ]; then
    config_write '@begin-no-ssl' '@end-no-ssl'
    config_prune '@begin-ssl' '@end-ssl'
else
    config_prune '@begin-no-ssl' '@end-no-ssl'
    config_write '@begin-ssl' '@end-ssl'
    config_subst 'NGINX_CERTIFICATE_NAME'
fi

eval sed ${SED_ARGS} \
    < /etc/nginx/conf.d/primero.conf.template \
    > /etc/nginx/conf.d/primero.conf
