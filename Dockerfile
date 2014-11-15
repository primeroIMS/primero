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

COPY docker/app/rvm-patchset.zip /tmp/rvm-patchset.zip

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y unzip curl && \
    cd /tmp && \
    unzip rvm-patchset.zip && \
    curl -sSL https://get.rvm.io | bash && \
    cd /tmp/rvm-patchsets-* && \
    /usr/local/rvm/bin/rvm-shell -c 'bash ./install.sh' && \
    /usr/local/rvm/bin/rvm-shell -c 'rvm install 2.1.2 -n railsexpress --patch railsexpress' && \
    /usr/local/rvm/bin/rvm-shell -c 'rvm --default use 2.1.2-railsexpress' && \
    cd / && rm -rf /tmp/rvm-patchsets-* && \
    # Remove all of the extra packages that the rvm installation pulls in \
    apt-get purge -y unzip curl patch gawk g++ gcc make libc6-dev patch libreadline6-dev zlib1g-dev \
        libssl-dev libyaml-dev libsqlite3-dev sqlite3 autoconf libgdbm-dev \
        libncurses5-dev automake libtool bison pkg-config libffi-dev && \
    apt-get autoremove -y && \
    apt-get clean

ADD Gemfile* /app/
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y git libssl-dev build-essential && \
    /usr/local/rvm/gems/ruby-2.1.2-railsexpress/wrappers/bundle install --without test development cucumber && \
    apt-get purge -y git libssl-dev build-essential && \
    apt-get autoremove -y && \
    apt-get clean

COPY docker/app/supervisord.conf /etc/primero-supervisord.conf
COPY docker/app/nginx-app /etc/nginx/sites-enabled/primero

ADD . /app

RUN chown -R primero.primero /app

RUN apt-get install -y default-jre && \
    /usr/local/rvm/gems/ruby-2.1.2-railsexpress/wrappers/bundle exec rake app:assets_precompile && \
    apt-get purge -y default-jre && \
    apt-get autoremove -y && \
    apt-get clean

