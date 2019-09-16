FROM solr:5-alpine

ENV SOLR_PACKAGES gettext libintl
ENV SOLR_USER=solr

USER root
COPY --chown=solr [ "solr/configsets/primero", "/solr-primero-config" ]
COPY --chown=solr [ "docker/solr/root", "docker/sub.sh", "/" ]
# Root level solr
COPY --chown=solr [ "solr/solr.xml", "/opt/solr" ]

RUN set -euox pipefail \
        ; apk update \
        ; apk add $SOLR_PACKAGES \
        ; chown -R $SOLR_USER:$SOLR_GROUP /opt/solr/server/solr/configsets \
        ; chmod -R 700 /opt/solr/server/solr/configsets \
        ; chmod +x /sub.sh

USER $SOLR_USER
# This could also be put in the compose file.
CMD ["solr-precreate", "primero", "/solr-primero-config"]
ENTRYPOINT ["docker-entrypoint.sh"]
