FROM ruby:2.6.2-alpine3.9

ENV BUILD_PACKAGES bash curl wget curl-dev build-base git
ENV BUILD_DEP_PACKAGES postgresql-dev nodejs-dev
ENV RUNTIME_PACKAGES bash libc6-compat nodejs gettext libintl yarn
ENV DEV_PACKAGES busybox-extras tree
ENV RAILS_ENV production

# Grab our path from --build-arg and store it in an env
ARG APP_ROOT
ENV APP_ROOT=${APP_ROOT}
ARG RAILS_LOG_PATH
ENV RAILS_LOG_PATH=${RAILS_LOG_PATH}

# Test if variables have been defined by build script
# otherwise return 1 and stop docker build
RUN set -ex ; \
        test -n "$APP_ROOT" || (printf "APP_ROOT not defined\n" ; \
            return 1); \
        test -n "$RAILS_LOG_PATH" || (printf "RAILS_LOG_PATH not defined\n" ; \
            return 1);


# Install our packages
RUN set -euox pipefail \
        ; apk update \
        ; apk add $BUILD_PACKAGES \
        ; apk add $BUILD_DEP_PACKAGES \
        ; apk add $DEV_PACKAGES \
        ; apk add --no-cache $RUNTIME_PACKAGES \
        ; rm -rf /var/cache/apk/*

# Install Gems first for docker cache
WORKDIR ${APP_ROOT}
COPY [ "Gemfile", "Gemfile.lock", "$APP_ROOT/" ]

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
COPY [ ".", "$APP_ROOT" ]
# Copying in the void configs for the asset precompilation step
COPY [ "docker/application/null_configs/*", "$APP_ROOT/config/" ]

# Create the directories for primero and install yarn for the asset precompile
RUN set -euox pipefail \
        ; mkdir -p \
        "$APP_ROOT/tmp" \
        "$RAILS_LOG_PATH" \
        ; cd "$APP_ROOT" \
        ; bin/rails tmp:cache:clear
            # ; bin/rails assets:precompile

CMD [ "primero-start" ]
ENTRYPOINT [ "/entrypoint.sh" ]
