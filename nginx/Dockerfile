FROM nginx:alpine

# remove any existing config files
RUN rm /etc/nginx/conf.d/*

# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

CMD [ "nginx", "-g", "daemon off;" ]