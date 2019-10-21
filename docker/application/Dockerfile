# -------------------------------------------------------------------- BUILD STAGE
FROM ruby:2.6.2-alpine3.9 AS build-env

ENV BUILD_PACKAGES bash curl wget curl-dev build-base git python
ENV BUILD_DEP_PACKAGES postgresql-dev
ENV RUNTIME_PACKAGES libc6-compat nodejs gettext libintl npm imagemagick
ENV DEV_PACKAGES busybox-extras tree cairo pixman pixman-dev
ENV RAILS_ENV production
ENV PYTHON /usr/bin/python

# Grab our path from --build-arg and store it in an env
ARG APP_ROOT
ENV APP_ROOT=${APP_ROOT}
ARG RAILS_LOG_PATH
ENV RAILS_LOG_PATH=${RAILS_LOG_PATH}

# Temporary build-time secrets needed to run rails processes.
# These are never persisted in the container images
ENV PRIMERO_SECRET_KEY_BASE=PRIMERO_SECRET_KEY_BASE
ENV DEVISE_SECRET_KEY=DEVISE_SECRET_KEY
ENV DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY

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
        # ; apk add $DEV_PACKAGES \
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

# Run npm install
COPY [ "package.json", "package-lock.json", "$APP_ROOT/" ]
RUN set -euox pipefail \
        ; npm install

# Note: This has its build context set to the root dir so prepend 'docker' to
# items that need to be copied from that directory
#
# Copy container overlay dir and substitution script
#COPY [ "docker/sub.sh", "docker/application/root/", "/" ]
# Now copy over primero and do setup
COPY [ ".", "$APP_ROOT" ]
# Copying in the void configs for the asset precompilation step
COPY [ "docker/application/null_configs/*", "$APP_ROOT/config/" ]

# Intentionally cached seperately
# Generates 32 random characters for the build-id...build id MUST be 32 characters (as its hardcoded)
RUN set -euox pipefail \
        ; mkdir -p /srv/primero/application/public \
        ; touch /srv/primero/application/public/build-id \
        ; echo "$RANDOM" > /srv/primero/application/public/build-id

# Build UI
RUN set -euox pipefail \
        ; npm run build

RUN set -euox pipefail \
        ; rm -rf node_modules .tmp webpack postcss.config.js \
        package.json package-lock.json babel.config.js app/javascript \
        /usr/local/bundle/bundler/gems/*/.git \
        /usr/local/bundle/cache/

# -------------------------------------------------------------------- FINAL

FROM ruby:2.6.2-alpine3.9

ENV BUILD_PACKAGES bash
ENV RUNTIME_PACKAGES libpq gettext libintl imagemagick

ARG APP_ROOT
ENV APP_ROOT=${APP_ROOT}
ENV RAILS_ENV production
ENV RAILS_PUBLIC_FILE_SERVER=${RAILS_PUBLIC_FILE_SERVER}

# Install our packages
RUN set -euox pipefail \
        ; apk update \
        ; apk add --no-cache $BUILD_PACKAGES \
        ; apk add --no-cache $RUNTIME_PACKAGES \
        ; rm -rf /var/cache/apk/*

COPY [ "docker/sub.sh", "docker/application/root/", "/" ]
COPY --from=build-env /usr/local/bundle/ /usr/local/bundle/
COPY --from=build-env $APP_ROOT $APP_ROOT

WORKDIR $APP_ROOT

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "primero-start" ]
