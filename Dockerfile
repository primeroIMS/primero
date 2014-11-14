FROM ubuntu:14.04
MAINTAINER Primero Dev <pnabutov@quoininc.com>

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
ENTRYPOINT ["/app/docker/app/entrypoint"]
CMD ["supervisord", "-c/etc/primero-supervisord.conf", "--nodaemon"]

RUN useradd -d /app --create-home --user-group -r primero
ENV RAILS_ENV production

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv 561F9B9CAC40B2F7 && \
    apt-get update -yq && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y apt-transport-https libxml2-dev libxslt1-dev imagemagick && \
    echo 'deb https://oss-binaries.phusionpassenger.com/apt/passenger trusty main' > /etc/apt/sources.list.d/passenger.list && \
    apt-get update -yq && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx-extras passenger && \
    apt-get clean

WORKDIR /app

RUN apt-get install -y wget unzip curl && \
    curl -sSL https://get.rvm.io | bash && \
    cd /tmp && \
    wget https://github.com/skaes/rvm-patchsets/archive/44dd746311133f8e666cb7658090c240fc7e336d.zip && \
    unzip *.zip && \
    apt-get purge wget unzip && \
    apt-get clean

USER primero

RUN cd /tmp/44dd* && \
    source /app/.rvm/scripts/rvm && \
    bash ./install.sh && \
    rvm install 2.1.2 -n railsexpress --patch railsexpress && \
    rvm --default use 2.1.2-railsexpress && \
    cd / && rm -rf /tmp/44dd*

ADD Gemfile* /app/
RUN bundle install --without test development cucumber

COPY docker/app/supervisord.conf /etc/primero-supervisord.conf
COPY docker/app/nginx-app /etc/nginx/sites-enabled/primero

ADD . /app
RUN /app/.rvm/wrappers/default/bundle exec rake app:assets_precompile

