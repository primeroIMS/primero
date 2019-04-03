#!/bin/bash

set -ex

#If no template dirs are specified. Use the defaults.
TEMPLATE_DIRS_DEFAULT=( "/etc/nginx/conf.d" )
TEMPLATE_DIRS=( "${TEMPLATE_DIRS[@]:-"${TEMPLATE_DIRS_DEFAULT[@]}"}" )
for prim_filename in "${TEMPLATE_DIRS[@]}"/*.template
do
  /sub.sh "${prim_filename}"
done

exec "$@"
