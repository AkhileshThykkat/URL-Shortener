# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire application code
COPY . .

COPY .env .env

# Expose the port your app runs on
EXPOSE 3000

# Run `npm run sync` before starting the application
CMD ["sh", "-c", "npm run sync && npm start"]
