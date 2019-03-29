FROM nginx

RUN set -ex; \
        rm /etc/nginx/conf.d/default.conf
#copy certificate
COPY ["nginx_self_signed/cert/*", "/etc/nginx/conf.d/"]
#copy configuration
COPY ["nginx_self_signed/conf/*", "/etc/nginx/conf.d/"]


