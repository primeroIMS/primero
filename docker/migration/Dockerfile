ARG BUILD_REGISTRY
ARG PRIMERO_VERSION
FROM ${BUILD_REGISTRY}primero/application:${PRIMERO_VERSION}

ENV MIGRATION_PACKAGES tini postgresql-client openssh openssh-keygen rsync

USER root
RUN set -euox pipefail \
        ; apk update \
        ; apk add --no-cache $MIGRATION_PACKAGES \
        ; rm -rf /var/cache/apk/*

USER docker-primero
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sleep", "infinity"]