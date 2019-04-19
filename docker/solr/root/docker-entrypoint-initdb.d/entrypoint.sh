#!/bin/bash

set -ex

# Search each of these directories for .template files and perform substitution
# If you want this to be done from environment, redefine TEMPLATE_DIRS not
# SOLR_TEMPLATE_DIRS_DEFAULT=( "/opt/solr" )
# SOLR_TEMPLATE_DIRS=( "${SOLR_TEMPLATE_DIRS[@]:-"${SOLR_TEMPLATE_DIRS_DEFAULT[@]}"}" )
# for prim_filename in "${SOLR_TEMPLATE_DIRS[@]}"/*.template
# do
#   # here we actually do the environment substitution
#   /sub.sh "${prim_filename}"
# done

/sub.sh "/opt/solr"
