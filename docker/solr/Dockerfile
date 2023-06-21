ARG BUILD_REGISTRY
FROM ${BUILD_REGISTRY}solr:8.11.2-slim

ENV SOLR_PACKAGES gettext curl
ENV SOLR_USER=solr
ENV LOG4J_PROPS="/log4j2.xml"

USER root
COPY --chown=solr [ "solr/configsets/primero", "/solr-primero-config" ]
COPY --chown=solr [ "docker/solr/root/docker-entrypoint-initdb.d", "docker/sub.sh", "/" ]
COPY --chown=solr [ "docker/solr/root/opt/solr/bin/.", "/opt/solr/bin" ]
COPY --chown=solr [ "docker/solr/root/var/solr/log4j2.xml", "/log4j2.xml" ]

# Root level solr
COPY --chown=solr [ "solr/solr.xml", "/opt/solr" ]

RUN bin/bash -c set -euox pipefail \
        ; apt update \
        ; apt install -y $SOLR_PACKAGES \
        ; addgroup -gid 200 mounted-volume \
        ; chown -R $SOLR_USER:$SOLR_GROUP /var/solr/data \
        ; chmod -R 700 /var/solr/data \
        ; chmod +x /sub.sh \
        ; cp /opt/solr/bin/solr.in.sh.orig /opt/solr/bin/solr.in.sh \
        ; echo 'Defending against CVE-2021-44228' \
        ; echo 'SOLR_OPTS="$SOLR_OPTS -Dlog4j2.formatMsgNoLookups=true"' >> /opt/solr/bin/solr.in.sh \
        ; mv /opt/solr/bin/solr.in.sh /etc/default/solr.in.sh

RUN mkdir -p /opt/logs; chown $SOLR_USER:$SOLR_GROUP /opt/logs

USER $SOLR_USER
# This could also be put in the compose file.
CMD ["solr-precreate", "primero", "/solr-primero-config"]
ENTRYPOINT ["docker-entrypoint.sh"]
