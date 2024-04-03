FROM node:20.11.1-slim

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

# libcurl3 is required for mongodb-memory-server, which is used for testing
RUN apt-get update && apt-get install -y libcurl3

RUN yarn install

COPY . ./

EXPOSE 8080
ENTRYPOINT ["yarn", "dev"]
