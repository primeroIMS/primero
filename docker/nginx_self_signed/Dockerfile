FROM nginx

WORKDIR /etc/nginx/conf.d
RUN set -ex; \
        apt update; \
        apt install -y openssl; \
        rm /etc/nginx/conf.d/default.conf; \
        openssl req -subj '/CN=localhost' -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 36

COPY [ "nginx_self_signed/conf/*", "/etc/nginx/conf.d/" ]
WORKDIR /etc/nginx
