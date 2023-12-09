FROM node:16-alpine as base
RUN apk add g++ make py3-pip
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
EXPOSE 3000

FROM base as production
RUN yarn install --frozen-lockfile
ENV NODE_ENV='production'
CMD [ "node", "dist/index.js" ]

FROM base as development
RUN yarn install
ENV NODE_ENV='development'
CMD [ "node_modules/.bin/gulp" ]
