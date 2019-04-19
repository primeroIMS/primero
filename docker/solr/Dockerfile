FROM solr:alpine

ENV SOLR_PACKAGES bash

USER root
COPY ["solr/configsets", "/opt/solr/server/solr/configsets"]
COPY [ "docker/solr/root", "docker/sub.sh", "/" ]
RUN set -ex \
        ; apk update \
        ; apk add $SOLR_PACKAGES \

        ; chown -R $SOLR_USER:$SOLR_GROUP /opt/solr/server/solr/configsets \
        ; chmod -R 700 /opt/solr/server/solr/configsets \
        ; chmod +x /sub.sh

USER $SOLR_USER
# This could also be put in the compose file.
CMD ["solr-precreate", "primero"]
ENTRYPOINT ["docker-entrypoint.sh"]
