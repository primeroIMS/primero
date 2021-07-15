#!/bin/bash
check_required_variables() {
 local required
  local result

  result=0

  set +ux
  required=( PRIMERO_HOST PRIMERO_SECRET_KEY_BASE DEVISE_SECRET_KEY DEVISE_JWT_SECRET_KEY PRIMERO_MESSAGE_SECRET )
  for var in "${required[@]}"
  do
    if [ -z "${!var}" ]
    then
      printf "Missing required environment variable: ${var}\\n"
      result=1
    fi
  done
  set -ux
  return $result
}

check_required_variables