# Use official Node.js LTS
FROM oven/bun:latest

# Set working directory inside container
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy rest of the app
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["bun", "index.ts"]
