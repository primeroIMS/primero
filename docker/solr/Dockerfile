ARG BUILD_REGISTRY
FROM ${BUILD_REGISTRY}solr:8.9.0-slim

ENV SOLR_PACKAGES gettext curl
ENV SOLR_USER=solr

USER root
COPY --chown=solr [ "solr/configsets/primero", "/solr-primero-config" ]
COPY --chown=solr [ "docker/solr/root/docker-entrypoint-initdb.d", "docker/sub.sh", "/" ]
COPY --chown=solr [ "docker/solr/root/opt/solr/bin/.", "/opt/solr/bin" ]
COPY --chown=solr [ "docker/solr/root/var/solr/log4j2.xml", "/var/solr" ]

# Root level solr
COPY --chown=solr [ "solr/solr.xml", "/opt/solr" ]

RUN bin/bash -c set -euox pipefail \
        ; apt update \
        ; apt install -y $SOLR_PACKAGES \
        ; chown -R $SOLR_USER:$SOLR_GROUP /var/solr/data \
        ; chmod -R 700 /var/solr/data \
        ; chmod +x /sub.sh

USER $SOLR_USER
# This could also be put in the compose file.
CMD ["solr-precreate", "primero", "/solr-primero-config"]
ENTRYPOINT ["docker-entrypoint.sh"]
