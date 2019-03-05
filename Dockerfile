# ---- Base Node ----
FROM node:10.12.0-alpine AS base

RUN apk update && apk add --no-cache nodejs-current tini

WORKDIR /home/node/app

COPY package.json package.json
COPY package-lock.json package-lock.json


# ---- Dependencies ----
FROM base AS dependencies

# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production

# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install


# ---- Test ----
# run linters, setup and tests
FROM base AS test
COPY --chown=node:node  --from=dependencies /home/node/app/node_modules ./node_modules
COPY . .
RUN npm run lint
# && npm run test

# ---- Release ----
FROM base AS release

USER node

# copy from dependecies build
COPY --chown=node:node  --from=dependencies /home/node/app/prod_node_modules ./node_modules
# copy app sources
COPY --chown=node:node . .

ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/npm", "run" ]
CMD ["start"]
