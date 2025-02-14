# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# ------------------------------------------------------------------ BUILD STAGE

ARG BUILD_REGISTRY
ARG version=1.27.4
# TODO: Although the rest of Primero uses Alpine 3.20 base images, Nginx doesn't have one.
ARG ALPINE_VERSION=3.21

FROM ${BUILD_REGISTRY}nginx:${version}-alpine${ALPINE_VERSION} AS builder
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

# ------------------------------------------------------------------ FINAL STAGE

ARG BUILD_REGISTRY
ARG version

FROM ${BUILD_REGISTRY}nginx:${version}-alpine${ALPINE_VERSION}
EXPOSE 80 443

ARG version
ARG NGINX_UID
ARG NGINX_GID
ENV USER_ID=${NGINX_UID}
ENV GROUP_ID=${NGINX_GID}
# TODO:
# If you are updating `version` or `ALPINE_VERSION`,
# run: `docker scout cves primero/nginx:my-tag` to verify whether the versions of the security packages
# listed in SECURITY_UPDATED_PACKAGES are still necessary.
ENV SECURITY_UPDATED_PACKAGES="libexpat>2.6.3-r0 curl>8.12.0-r0 musl=1.2.5-r9 musl-utils=1.2.5-r9"

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
    ; apk add --no-cache $SECURITY_UPDATED_PACKAGES \
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
