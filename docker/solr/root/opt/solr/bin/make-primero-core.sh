#!/bin/bash

set -e

CORE_NAME=${1}

[ -z "${CORE_NAME}" ] && echo "Please provide the name of the new Primero Solr code" && exit 1

precreate-core $CORE_NAME /solr-primero-config
echo "name=${CORE_NAME}" > /opt/solr/server/solr/mycores/${CORE_NAME}/core.properties
