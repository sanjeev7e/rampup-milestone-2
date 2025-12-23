FROM node:20-bullseye

# Set up the parent directory to simulate the standard project structure
# serverless.yml expects a build script in ../ts-build.sh
WORKDIR /app
RUN echo '#!/bin/sh' > ts-build.sh && \
    echo 'echo "Skipping external build script in container; using local build"' >> ts-build.sh && \
    chmod +x ts-build.sh

# Set the working directory for the service
WORKDIR /app/products

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run build

# Run serverless offline, bound to all interfaces
CMD ["npm", "run", "offline", "--", "--host", "0.0.0.0"]
