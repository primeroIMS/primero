FROM alpine:latest

ARG BEANSTALKD_PORT

COPY [ "beanstalkd/root/", "/" ]

RUN set -euox pipefail \
        ; chmod +x /entrypoint.sh \
        ; apk add --update --no-cache tini beanstalkd bash \
        ; rm -rf /var/cache/apk/* \

EXPOSE ${BEANSTALKD_PORT}

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]
