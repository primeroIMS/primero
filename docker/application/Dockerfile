FROM ruby:2.6.2-alpine3.9

ENV BUILD_PACKAGES bash curl wget curl-dev build-base git
ENV BUILD_DEP_PACKAGES postgresql-dev nodejs-dev
ENV RUNTIME_PACKAGES libc6-compat nodejs
ENV DEV_PACKAGES busybox-extras
ENV RAILS_ENV production

RUN set -ex \
        ; apk update \
        ; apk add $BUILD_PACKAGES \
        ; apk add $BUILD_DEP_PACKAGES \
        ; apk add $DEV_PACKAGES \
        ; apk add --no-cache $RUNTIME_PACKAGES \
        ; rm -rf /var/cache/apk/*

# Install Gems first for docker cache
WORKDIR /srv/primero/application
COPY [ "Gemfile", "Gemfile.lock", "/srv/primero/application/" ]

# Run bundle install
RUN set -ex \
        ; bundle install --without development test cucumber

# Copy container overlay dir
COPY [ "application/root/", "/" ]
# Copy substitution script
COPY [ "sub.sh", "/" ]
# Now copy over primero and do setup
COPY [ ".", "/srv/primero/application" ]

# TODO: move srv/p/app/log to srv/p/log
RUN set -ex \
        ; mkdir -p \
            /srv/primero/log/rails \
            /srv/primero/application/tmp \
            /srv/primero/application/log \
        ; touch /srv/primero/application/log/production.log

