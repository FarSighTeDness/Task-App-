FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=300

EXPOSE 300

CMD ["npm", "start"]