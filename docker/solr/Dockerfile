FROM solr:7.7.1-alpine

ENV SOLR_PACKAGES gettext libintl

USER root
COPY ["solr/configsets/primero", "/solr-primero-config"]
# COPY ["solr/configsets", "/opt/solr/server/solr/configsets"]
COPY [ "docker/solr/root", "docker/sub.sh", "/" ]
RUN set -ex \
        ; apk update \
        ; apk add $SOLR_PACKAGES \
        ; chown -R $SOLR_USER:$SOLR_GROUP /opt/solr/server/solr/configsets \
        ; chmod -R 700 /opt/solr/server/solr/configsets \
        ; chmod +x /sub.sh

USER $SOLR_USER
# This could also be put in the compose file.
CMD ["solr-precreate", "primero", "/solr-primero-config"]
ENTRYPOINT ["docker-entrypoint.sh"]
