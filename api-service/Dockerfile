# Build OTT Microservice
FROM node:14.17-alpine AS build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
RUN npm install --silent
RUN npm install pm2 -g
COPY . ./

EXPOSE 4000

CMD ["pm2-runtime", "index.js"]