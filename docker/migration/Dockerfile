# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

ARG BUILD_REGISTRY
ARG PRIMERO_VERSION
FROM ${BUILD_REGISTRY}primero/application:${PRIMERO_VERSION}

ENV MIGRATION_PACKAGES="postgresql-client openssh openssh-keygen rsync"

USER root
RUN set -euox pipefail \
        ; apk update \
        ; apk add --no-cache $MIGRATION_PACKAGES \
        ; rm -rf /var/cache/apk/*

USER docker-primero
RUN set -euox pipefail \
        ; mkdir -p /home/docker-primero/.ssh

CMD ["sleep", "infinity"]