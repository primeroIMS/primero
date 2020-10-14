FROM nginx:1.19.3-alpine
EXPOSE 80 443

ARG USER_ID
ARG GROUP_ID
ENV USER_ID=${NGINX_UID}
ENV GROUP_ID=${NGINX_GID}

COPY [ "nginx/primero.conf.template", "/etc/nginx/templates/" ]
COPY [ "nginx/entrypoint.sh", "/usr/local/bin/" ]
COPY [ "nginx/update-nginx-conf.sh", "/usr/local/bin/" ]
COPY [ "nginx/nginx.conf.template", "/etc/nginx/" ]
COPY [ "nginx/nginx_limits.conf.template", "/etc/nginx/" ]

RUN set -ex \
    ; addgroup -g $GROUP_ID docker-nginx \
    ; adduser --disabled-password --gecos '' -u $USER_ID -G docker-nginx docker-nginx \
    ; rm -f /etc/nginx/conf.d/default.conf \
    ; chmod +x /usr/local/bin/entrypoint.sh \
    ; chmod +x /usr/local/bin/update-nginx-conf.sh \
    ; mkdir -p /certs \
    ; chown -R docker-nginx:docker-nginx /certs \
    ; apk update \
    ; apk add openssl
    ; mkdir -p /etc/letsencrypt \
    ; chown -R docker-nginx:docker-nginx /etc/letsencrypt \
    ; mkdir -p /usr/share/nginx/html/.well-known/acme-challenge \
    ; chown -R docker-nginx:docker-nginx /usr/share/nginx/html \
    ; chown -R docker-nginx:docker-nginx /etc/nginx/conf.d \
    ; chown -R docker-nginx:docker-nginx /var/cache/nginx \
    ; chown -R docker-nginx:docker-nginx /var/log/nginx \
    ; touch /var/run/nginx.pid \
    ; chown -R docker-nginx:docker-nginx /var/run/nginx.pid

USER docker-nginx

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD [ "nginx", "-g", "daemon off;" ]
