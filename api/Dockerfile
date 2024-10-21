ARG NODE_VERSION=22.9.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

################################################################################
# Final stage
FROM base as final

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (since we're running in dev mode)
RUN npm ci

# Copy the rest of the application
COPY . .

# Fix permissions for the node user
RUN chown -R node:node /usr/src/app

# Switch to non-root user after all file operations are done
USER node

# Expose the port that the application listens on.
EXPOSE 9000

# Run the application
CMD ["npm", "run", "dev"]
