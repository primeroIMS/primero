FROM alpine:3.11

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG BEANSTALKD_PORT
ENV BEANSTALKD_PORT=${BEANSTALKD_PORT}

COPY [ "beanstalkd/root/", "/" ]

RUN set -euox pipefail \
        ; addgroup -g $GROUP_ID primero \
        ; adduser --disabled-password --gecos '' -u $USER_ID -G primero primero

RUN set -euxo pipefail \
        ; chmod +x /entrypoint.sh \
        ; apk add --update --no-cache tini beanstalkd curl bash \
        ; rm -rf /var/cache/apk/* \
        ; mkdir -p /var/lib/beanstalkd \
        ; chmod -R 700 /var/lib/beanstalkd \
        ; chown -R primero /var/lib/beanstalkd

EXPOSE ${BEANSTALKD_PORT}

USER primero

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]

CMD ["beanstalkd-start"]
