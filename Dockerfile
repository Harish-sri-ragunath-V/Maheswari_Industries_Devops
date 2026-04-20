FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

EXPOSE 5000

CMD ["node", "server.js"]