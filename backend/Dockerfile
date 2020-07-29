FROM node:10.11-alpine

RUN apk add git

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 3000
CMD ["node", "/app/server.js"]
