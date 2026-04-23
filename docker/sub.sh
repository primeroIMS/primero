#!/bin/bash
# PARAM: This script takes a dir path as the only input parameter.
# It will search for every file in the specified dir and perform substitution
# on any file that matches *.template. It replaces any bash style variables
# with the correct value. It will recurse through all sub directories. There is
# currently no way to stop this.

set -euox pipefail
# Takes an input file, copies the file and removes the .template extension.
prim_rename_file() {
  #check if filename has .template extension.
  if [ "${PRIM_FILENAME##*.}" == "template" ]; then
    # if it does then copy the .template file to its proper name
    cp -f "${PRIM_FILENAME}" "${PRIM_FILENAME%.*}"
    # change the filename to reflect the copied version
    PRIM_FILENAME="${PRIM_FILENAME%.*}"
  fi

  # Return the new filename
  echo "$PRIM_FILENAME"
  return 0
}

# Does substitutions on the new file you can replace tee with > if you want to
# avoid outputting the filename to the prompt
prim_perform_substitution() {
  printf "Performing substitution on: %s\\n" "${PRIM_FILENAME}"
  # This sed call ensures that only currently defined env variables are
  # replaced.
  envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" > "${PRIM_NEW_FILENAME}" < "${PRIM_FILENAME}"
}

set +x
# TODO: Does this loop break if the filename has spaces? Maybe
# Perform the actual substitution loop
for prim_path in $(find "$1" -iname "*.template" -print0 | xargs -0 -n1);
do
  echo "$prim_path"
  PRIM_FILENAME="$prim_path"
  PRIM_NEW_FILENAME=$(prim_rename_file "${PRIM_FILENAME}")
  # If the filename has a .template extension, then we are going to copy it to
  # the same name / path without .template to avoid overwriting our template
  prim_perform_substitution
done
set -ex
