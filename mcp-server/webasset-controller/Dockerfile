FROM node:20-slim

# Install Playwright dependencies and browsers
RUN apt-get update && apt-get install -y \
    chromium \
    libgbm1 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npx playwright install chromium --with-deps

# Copy application files
COPY . .

# Create non-root user
RUN useradd -m -u 1001 nodeuser && \
    chown -R nodeuser:nodeuser /app

USER nodeuser

EXPOSE 3000

CMD ["node", "src/index.js"]
