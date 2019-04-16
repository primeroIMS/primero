#!/bin/bash

set -ex
printf "Starting Primero application container\\n"
printf "Performing configuration substitution"


# Search each of these directories for .template files and perform substitution
# If you want this to be done from environment, redefine TEMPLATE_DIRS not
APP_TEMPLATE_DIRS_DEFAULT=( "/srv/primero/application/config" )
APP_TEMPLATE_DIRS=( "${APP_TEMPLATE_DIRS[@]:-"${APP_TEMPLATE_DIRS_DEFAULT[@]}"}" )
for prim_filename in "${APP_TEMPLATE_DIRS[@]}"/*.template
do
  # here we actually do the environment substitution
  /sub.sh "${prim_filename}"
done

exec "$@"
