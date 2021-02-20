FROM node:14.15.5-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
