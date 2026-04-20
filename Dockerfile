FROM node:20

WORKDIR /app

# Install Chromium (needed for Puppeteer)
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy only dependency files first (IMPORTANT for caching)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy remaining source code
COPY backend/ .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
