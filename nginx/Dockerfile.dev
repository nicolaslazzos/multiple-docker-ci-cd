FROM nginx:alpine

# remove any existing config files
RUN rm /etc/nginx/conf.d/*

# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]