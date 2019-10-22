FROM alpine:latest

ARG BEANSTALKD_PORT

RUN set -euox pipefail \
        ; apk add --update --no-cache tini beanstalkd \
        ; rm -rf /var/cache/apk/* \
        ; chown -R beanstalk /beanstalkd

EXPOSE 11300
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["beanstalkd", "-V", "-p", $BEANSTALKD_PORT , "-u", "beanstalk", "-b", "/var/lib/beanstalkd"]
