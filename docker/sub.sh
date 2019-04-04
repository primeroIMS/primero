#!/bin/bash

# This script takes a filename as the only input parameter.
# 
# It replaces any bash style variables with the correct value
# from the environment.
prim_rename_file() {
  #check if filename has .template extension. 
  if [ "${PRIM_FILENAME##*.}" == "template" ]; then
    cp "${PRIM_FILENAME}" "${PRIM_FILENAME%.*}"
    PRIM_FILENAME="${PRIM_FILENAME%.*}"
  fi

  echo "$PRIM_FILENAME"
  return 0
}

# Checks if there is a matching file with 'filename.template.default'
# if so we source it to load the default params
prim_source_defaults() {
  if [ -x "${PRIM_DEFAULT_FILENAME}" ];
  then
    source "${PRIM_DEFAULT_FILENAME}"
    # rm -f "${PRIM_DEFAULT_FILENAME}"
  else 
    (>&2 echo "Failed to find defaults file: ${PRIM_DEFAULT_FILENAME}")
  fi
    return 0
}

# 
prim_perform_substitution() {
  echo "${PRIM_FILENAME}"
  cat "${PRIM_FILENAME}" | envsubst | tee "${PRIM_FILENAME}"
}
PRIM_FILENAME="${1}"
PRIM_DEFAULT_FILENAME="${1}.default"
# Check if the filename has .template extension. If so, drop the .template
# to avoid overwriting the template.
PRIM_FILENAME=$(prim_rename_file "${PRIM_FILENAME}")

prim_source_defaults "${PRIM_DEFAULT_FILENAME}"
prim_perform_substitution 

