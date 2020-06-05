FROM alpine:3.11

ARG BEANSTALKD_PORT
ENV BEANSTALKD_PORT=${BEANSTALKD_PORT}

COPY [ "beanstalkd/root/", "/" ]

RUN set -euox pipefail \
        ; chmod +x /entrypoint.sh \
        ; apk add --update --no-cache tini beanstalkd curl bash \
        ; rm -rf /var/cache/apk/*

EXPOSE ${BEANSTALKD_PORT}

USER beanstalk

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]

CMD ["beanstalkd-start"]
