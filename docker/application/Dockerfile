FROM ruby:2.4.5-alpine3.8

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
WORKDIR /srv/primero
COPY [ "Gemfile", "Gemfile.lock", "/srv/primero/" ]

RUN set -ex \
        ; bundle install --without development test cucumber

# Now copy over primero and do setup
COPY [ ".", "/srv/primero" ]
RUN mkdir -p /srv/primero/{tmp,log,bin}
RUN mkdir -p /srv/primero/application/daemons
RUN mkdir -p /srv/primero/log/{nginx,rails}

COPY [ "docker/application/entrypoint.sh", "/" ]

# ENV NO_RESEED

# RUN set -ex \
#         ; rake db:migrate:design \
#         ; if [ -n "${NO_RESEED+x}" ] \
#         ; then rake db:seed \
#         ; fi \
#         ; rake db:migrate \
#         ; rake sunspot:reindex \
#         ; rake tmp:cache:clear \
#         ; rake app:assets_precompile

