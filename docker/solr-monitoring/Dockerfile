FROM --platform=linux/amd64 alpine:latest

ENV SOLR_USER=solr

COPY solr-monitoring/root/monitor_solr_logs.sh /usr/local/bin/

USER root

# Add the solr group and user

RUN addgroup -g 8983 $SOLR_USER \
    && adduser -S -u 8983 -G $SOLR_USER $SOLR_USER \
    && mkdir -p /usr/local/bin/ \
    && mkdir -p /solr/logs \
    && chown $SOLR_USER:$SOLR_USER /solr/logs \
    && chown $SOLR_USER:$SOLR_USER /usr/local/bin/monitor_solr_logs.sh \
    && chmod +x /usr/local/bin/monitor_solr_logs.sh \
    && apk update \
    && apk add --no-cache aws-cli


USER $SOLR_USER

# Start the monitoring script
CMD ["monitor_solr_logs.sh"]

