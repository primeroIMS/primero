FROM nginx:1.19.3-alpine
EXPOSE 8080 4430

COPY [ "nginx/primero.conf.template", "/etc/nginx/templates/" ]
COPY [ "nginx/entrypoint.sh", "/usr/local/bin/" ]
COPY [ "nginx/update-nginx-conf.sh", "/usr/local/bin/" ]
COPY [ "nginx/nginx.conf.template", "/etc/nginx/" ]
COPY [ "nginx/nginx_limits.conf.template", "/etc/nginx/" ]

RUN set -ex \
    ; rm -f /etc/nginx/conf.d/default.conf \
    ; chmod +x /usr/local/bin/entrypoint.sh \
    ; chmod +x /usr/local/bin/update-nginx-conf.sh \
    ; mkdir -p /certs \
    ; chown -R nginx:nginx /certs \
    ; apk update \
    ; apk add openssl \
    ; mkdir -p /etc/letsencrypt \
    ; chown -R nginx:nginx /etc/letsencrypt \
    ; mkdir -p /usr/share/nginx/html/.well-known/acme-challenge \
    ; chown -R nginx:nginx /usr/share/nginx/html \
    ; chown -R nginx:nginx /etc/nginx/conf.d \
    ; chown -R nginx:nginx /var/cache/nginx \
    ; chown -R nginx:nginx /var/log/nginx \
    ; touch /var/run/nginx.pid \
    ; chown -R nginx:nginx /var/run/nginx.pid

USER nginx

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD [ "nginx", "-g", "daemon off;" ]
