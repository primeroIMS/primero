FROM ruby:2.6.2-alpine3.9

ENV BUILD_PACKAGES bash curl wget curl-dev build-base git
ENV BUILD_DEP_PACKAGES postgresql-dev nodejs-dev
ENV RUNTIME_PACKAGES bash libc6-compat nodejs gettext libintl yarn
ENV DEV_PACKAGES busybox-extras
ENV RAILS_ENV production

RUN set -euox pipefail \
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
RUN set -euox pipefail \
        ; if [ $RAILS_ENV == "production" ]; \
        then \
            bundle install --without development test cucumber \
        ; else \
            bundle install \
        ; fi


# Note: This has its build context set to the root dir so prepend 'docker' to
# items that need to be copied from that directory
#
# Copy container overlay dir and substitution script
COPY [ "docker/sub.sh", "docker/application/root/", "/" ]
# Now copy over primero and do setup
COPY [ ".", "/srv/primero/application" ]
# Copying in the void configs for the asset precompilation step
COPY [ "docker/application/null_configs/*", "/srv/primero/application/config/" ]

# Create the directories for primero and install yarn for the asset precompile
RUN set -euox pipefail \
        ; mkdir -p \
            /srv/primero/log/rails \
            /srv/primero/application/tmp \
            /srv/primero/application/log \
            ; cd "/srv/primero/application"
            # ; bin/rails tmp:cache:clear \
            # ; bin/rails assets:precompile

VOLUME /srv/primero/application/public
CMD [ "primero-start" ]
ENTRYPOINT [ "/entrypoint.sh" ]
