# ---- Base Node ----
FROM node:10.12.0-alpine AS base

WORKDIR /home/node/app

RUN apk update && apk add --no-cache nodejs-current tini

COPY . .
RUN npm install

USER node

ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/node" ]
CMD ["index.js"]
