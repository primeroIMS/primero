#!/bin/bash

# This script takes a filename as the only input parameter.
# 
# It replaces any bash style variables with the correct value
# from the environment.
prim_rename_file() {
  #check if filename has .template extension. 
  if [ "${PRIM_FILENAME##*.}" == "template" ]; then
    # if it does then copy the .template file to its proper name
    cp "${PRIM_FILENAME}" "${PRIM_FILENAME%.*}"
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
    # rm -f "${PRIM_DEFAULT_FILENAME}"
  else 
    (>&2 echo "Failed to find defaults file: ${PRIM_DEFAULT_FILENAME} \
      You can safely ignore this.")
  fi
    return 0
}

# Does substitutions on the new file you can replace tee with > if you want to
# avoid outputting the filename to the prompt
prim_perform_substitution() {
  printf "%s\\n---------------\\n" "${PRIM_FILENAME}"
  cat "${PRIM_FILENAME}" | envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" | tee "${PRIM_FILENAME}"
  
  printf "\\n---------------\\n"
}
PRIM_FILENAME="${1}"
PRIM_DEFAULT_FILENAME="${1}.default"
# If the filename has a .template extension, then we are going to copy it to
# the same name / path without .template to avoid overwriting our template
PRIM_FILENAME=$(prim_rename_file "${PRIM_FILENAME}")

prim_source_defaults 
prim_perform_substitution 

