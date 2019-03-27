FROM ruby:2.4.5-alpine

ENV BUILD_PACKAGES bash curl wget curl-dev build-base git
ENV BUILD_DEP_PACKAGES postgresql-dev
ENV RAILS_ENV production

RUN set -ex \
        ; apk update \
        ; apk add $BUILD_PACKAGES \
        ; apk add $BUILD_DEP_PACKAGES \
        ; rm -rf /var/cache/apk/*

COPY [ ".", "/srv/primero" ]

WORKDIR /srv/primero

RUN mkdir /srv/primero/tmp

RUN set -ex \
        ; bundle install --without development test cucumber

# TODO: Config sunsport

# TODO: Copy mailers config
# TODO: Copy locale config
# TODO: queue
# TODO: couch watcher
# TODO: queue consumer
#

# ENV NO_RESEED

RUN set -ex \
        ; rake db:migrate:design \

        ; if [ -n "${NO_RESEED+x}" ] \
        ; then rake db:seed \
        ; fi \

        ; rake db:migrate \
        ; rake sunspot:reindex \
        ; rake tmp:cache:clear \
        ; rake app:assets_precompile
# TODO: primero scheduler
# TODO: couch history lo
# TODO: load other stuff than restart puma?
