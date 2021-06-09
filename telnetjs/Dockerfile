FROM node:16-alpine3.11

WORKDIR /app
COPY ./package*.json ./
RUN npm ci --quiet
ENV PATH="./node_modules/.bin:${PATH}"
EXPOSE 8000

COPY . .
RUN npm run-script build

