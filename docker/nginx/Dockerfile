FROM nginx:1.19.3-alpine

COPY [ "nginx/root/", "/" ]

RUN set -ex \
    ; rm -f /etc/nginx/conf.d/default.conf \
    ; chmod +x /usr/local/bin/entrypoint.sh \
    ; chmod +x /usr/local/bin/update-nginx-conf.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD [ "nginx", "-g", "daemon off;" ]
