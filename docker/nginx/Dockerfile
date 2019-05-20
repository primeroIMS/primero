FROM nginx:alpine
VOLUME /certs
EXPOSE 80 443

COPY [ "nginx/root/", "/" ]
COPY [ "sub.sh", "/" ]

RUN set -euox pipefail; \
        chmod +x /sub.sh /entrypoint.sh; \
        apk update; \
        apk add openssl bash certbot supervisor ; \
        chmod 0644 /etc/cron.d/*

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor.conf"]
ENTRYPOINT ["/entrypoint.sh"]
