FROM node:17-alpine as BUILD

WORKDIR '/app'

# PM2 ensures that our app is always restarted if crashes
RUN npm install --global pm2

COPY package.json .
RUN npm i
COPY . .
RUN npm run build

# run container as non-root user, the node user is provided in the node.js alpine base image
USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]