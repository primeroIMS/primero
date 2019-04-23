FROM alpine:latest

RUN set -euox pipefail \
        ; apk add --update --no-cache beanstalkd \
        ; rm -rf /var/cache/apk/* \
        ; mkdir -p /beanstalkd/bin
        # ; chown -R beanstalk:beanstalk /beanstalkd

EXPOSE 11300
CMD ["beanstalkd","-p","11300","-u","beanstalk","-b","/beanstalkd/bin","-V"]
