FROM nginx

COPY root/ /

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["/entrypoint.sh"]
