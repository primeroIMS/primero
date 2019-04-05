FROM nginx:alpine
VOLUME /certs

COPY nginx_production/root/ /
COPY [ "nginx_production/entrypoint.sh", "sub.sh", "/" ]

RUN set -ex; \
        chmod +x /sub.sh /entrypoint.sh; \
        apk update; \
        apk add openssl bash 

EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["/entrypoint.sh"]
