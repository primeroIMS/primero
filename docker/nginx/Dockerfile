ARG version=1.23.3
ARG BUILD_REGISTRY

FROM nginx:${version}-alpine AS builder

ARG version

WORKDIR /root/

RUN apk add --update --no-cache build-base git pcre-dev openssl-dev zlib-dev linux-headers \
    && wget http://nginx.org/download/nginx-${version}.tar.gz \
    && tar zxf nginx-${version}.tar.gz \
    && git clone https://github.com/quoin/ngx_brotli.git \
    && git clone https://github.com/quoin/headers-more-nginx-module.git \
    && cd ngx_brotli \
    && git submodule update --init --recursive \
    && cd ../nginx-${version} \
    && ./configure \
    --add-dynamic-module=../ngx_brotli \
    --add-dynamic-module=../headers-more-nginx-module \
    --with-compat \
    && make modules

ARG BUILD_REGISTRY
FROM ${BUILD_REGISTRY}nginx:${version}-alpine
EXPOSE 80 443

ARG version
ARG NGINX_UID
ARG NGINX_GID
ENV USER_ID=${NGINX_UID}
ENV GROUP_ID=${NGINX_GID}

COPY [ "nginx/root/", "/" ]

RUN set -ex \
    ; addgroup -g $GROUP_ID docker-nginx \
    ; adduser --disabled-password --gecos '' -u $USER_ID -G docker-nginx docker-nginx \
    ; rm -f /etc/nginx/conf.d/default.conf \
    ; chmod +x /usr/local/bin/entrypoint.sh \
    ; chmod +x /usr/local/bin/update-nginx-conf.sh \
    ; mkdir -p /certs \
    ; chown -R docker-nginx:docker-nginx /certs \
    ; apk update \
    ; apk add openssl \
    ; mkdir -p /etc/letsencrypt \
    ; mkdir -p /etc/letsencrypt/accounts \
    ; mkdir -p /etc/letsencrypt/archive \
    ; mkdir -p /etc/letsencrypt/keys \
    ; mkdir -p /etc/letsencrypt/live \
    ; chmod -R 755 /etc/letsencrypt \
    ; chown -R docker-nginx:docker-nginx /etc/letsencrypt \
    ; mkdir -p /usr/share/nginx/html/.well-known/acme-challenge \
    ; chown -R docker-nginx:docker-nginx /usr/share/nginx/html \
    ; chown -R docker-nginx:docker-nginx /etc/nginx/conf.d \
    ; chown -R docker-nginx:docker-nginx /var/cache/nginx \
    ; chown -R docker-nginx:docker-nginx /var/log/nginx \
    ; touch /var/run/nginx.pid \
    ; chown -R docker-nginx:docker-nginx /var/run/nginx.pid

RUN apk add libcap && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx

USER docker-nginx

COPY --from=builder /root/nginx-${version}/objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=builder /root/nginx-${version}/objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/
COPY --from=builder /root/nginx-${version}/objs/ngx_http_headers_more_filter_module.so /usr/lib/nginx/modules/

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD [ "nginx", "-g", "daemon off;" ]
