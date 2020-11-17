FROM alpine:3.11

ARG BEANSTALKD_PORT
ENV BEANSTALKD_PORT=${BEANSTALKD_PORT}

COPY [ "root/", "/" ]

RUN set -euxo pipefail \
        ; chmod +x /entrypoint.sh \
        ; apk add --update --no-cache tini beanstalkd curl bash \
        ; rm -rf /var/cache/apk/* \
        ; mkdir -p /var/lib/beanstalkd \
        ; chmod -R 700 /var/lib/beanstalkd \
        ; chown -R beanstalk /var/lib/beanstalkd


EXPOSE ${BEANSTALKD_PORT}

USER beanstalk

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]

CMD ["beanstalkd-start"]
