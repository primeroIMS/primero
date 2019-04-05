FROM alpine:latest

RUN apk add --update --no-cache beanstalkd && rm -rf /var/cache/apk/*
RUN mkdir -p /beanstalkd/bin
RUN chown -R beanstalk /beanstalkd

EXPOSE 11300
CMD ["beanstalkd","-p","11300","-u","beanstalk","-b","/beanstalkd/bin","-V"]
