FROM node:16-alpine3.11 as node

FROM node as asset_builder
WORKDIR /app
COPY ./moo.js/package*.json ./
RUN npm ci --quiet
ENV PATH="./node_modules/.bin:${PATH}"

COPY ./moo.js/ .
RUN npm run-script build-client

FROM nginx:1.21.0-alpine as nginx
FROM nginx
RUN apk add nginx-mod-http-js
RUN mkdir -p /webroot/assets
COPY --from=asset_builder /app/dist/bundle.js /webroot/assets
