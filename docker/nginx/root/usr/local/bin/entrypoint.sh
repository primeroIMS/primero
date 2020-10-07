#! /bin/sh

set -ex

if [ "$1" = "nginx" ]; then
    update-nginx-conf.sh
fi

exec "${@}"
