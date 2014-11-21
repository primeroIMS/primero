FROM ubuntu:14.04
MAINTAINER Primero Dev <pnabutov@quoininc.com>

EXPOSE 5984 6984
ENTRYPOINT ["/entrypoint"]
CMD ["supervisord", "-c/etc/couch-supervisord.conf", "--nodaemon"]

VOLUME /var/lib/couchdb /var/log/couchdb /etc/ssl/primero /etc/couchdb/local.d

ADD couch_ca.crt /usr/local/share/ca-certificates/couch_ca.crt

RUN apt-get update -yq && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y couchdb nginx supervisor && \
    apt-get clean

RUN echo 'daemon off;' >> /etc/nginx/nginx.conf

ADD nginx-couch /etc/nginx/sites-enabled/couchdb
ADD local.ini /etc/couchdb/local.ini
ADD supervisord.conf /etc/couch-supervisord.conf
ADD entrypoint /entrypoint
