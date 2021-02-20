FROM node:14.15.5-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 5000
ENTRYPOINT ["npm", "run", "dev:server"]
