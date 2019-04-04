FROM nginx

COPY nginx_production/root/ /

COPY [ "nginx_self_signed/entrypoint.sh", "sub.sh", "/" ]
RUN set -ex; \
        chmod +x /sub.sh /entrypoint.sh

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["/entrypoint.sh"]
