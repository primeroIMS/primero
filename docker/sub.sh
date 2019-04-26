#!/bin/bash

set -euox pipefail

# This script takes a filename as the only input parameter.
#
# It replaces any bash style variables with the correct value
# from the environment.
prim_rename_file() {
  #check if filename has .template extension.
  if [ "${PRIM_FILENAME##*.}" == "template" ]; then
    # if it does then copy the .template file to its proper name
    cp -f "${PRIM_FILENAME}" "${PRIM_FILENAME%.*}"
    # change the filename to reflect the copied version
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
    printf "Importing environment variables from %s\\n" "$PRIM_DEFAULT_FILENAME"
  fi
    return 0
}

# Does substitutions on the new file you can replace tee with > if you want to
# avoid outputting the filename to the prompt
prim_perform_substitution() {
  printf "Performing substitution on: %s\\n" "${PRIM_FILENAME}"
  cat "${PRIM_FILENAME}" | envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" > "${PRIM_NEW_FILENAME}"
}

set +x
# Does this loop break if the filename has spaces? Maybe
for prim_path in $(find "$1" -iname "*.template" -print0 | xargs -0 -n1);
do
  echo "$prim_path"
  PRIM_FILENAME="$prim_path"
  PRIM_NEW_FILENAME=$(prim_rename_file "${PRIM_FILENAME}")
  PRIM_DEFAULT_FILENAME="$prim_path.default"
  # If the filename has a .template extension, then we are going to copy it to
  # the same name / path without .template to avoid overwriting our template
  prim_source_defaults
  prim_perform_substitution
done
set -ex
