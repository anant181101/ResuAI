FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm i
COPY src ./src
EXPOSE 5000
CMD ["npm","start"]
