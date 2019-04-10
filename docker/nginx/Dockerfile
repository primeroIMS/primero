FROM nginx:alpine
VOLUME /certs
EXPOSE 80 443

COPY nginx/root/ /
COPY [ "nginx/entrypoint.sh", "sub.sh", "/" ]

RUN set -ex; \
        chmod +x /sub.sh /entrypoint.sh; \
        apk update; \
        apk add openssl bash certbot

CMD ["nginx-debug", "-g", "daemon off;"]
ENTRYPOINT ["/entrypoint.sh"]
