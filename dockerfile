# Use a base image for Node.js
FROM node:18 AS builder

# Set the working directory for frontend
WORKDIR /app/frontend

# Set the environment for production
ENV VITE_API_URL=/api

# Copy frontend package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Build the frontend
COPY frontend .
RUN npm run build


# Set the working directory for backend
WORKDIR /app/backend

# Set the environment for backend
ENV NODE_ENV=production
ENV PORT=3000
ENV DEFAULT_ADMIN_NAME=admin
ENV DEFAULT_ADMIN_PASSWORD=admin

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the frontend build output into the backend directory
RUN cp -r /app/frontend/dist /app/backend/dist

# Copy the rest of the backend source code
COPY backend .

# Use a lightweight Node.js image for production
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy backend files from the builder stage
COPY --from=builder /app/backend .

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
