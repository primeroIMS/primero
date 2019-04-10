FROM alpine
EXPOSE 80 443

LABEL Name="Certbot crond agent"
LABEL Version="0.1"

RUN set -ex; \
        apk update ; \
        apk add bash certbot

COPY certbot-crond/root /

VOLUME ["/etc/letsencrypt", "/var/lib/letsencrypt"]
CMD ["crond", "-f"]
