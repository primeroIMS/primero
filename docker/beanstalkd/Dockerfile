FROM alpine:latest

RUN set -euox pipefail \
        ; apk add --update --no-cache tini beanstalkd \
        ; rm -rf /var/cache/apk/* \
        ; mkdir -p /beanstalkd/bin \
        ; chown -R beanstalk /beanstalkd

EXPOSE 11300
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["beanstalkd", "-V", "-p","11300","-u","beanstalk","-b","/beanstalkd/bin","-V"]
