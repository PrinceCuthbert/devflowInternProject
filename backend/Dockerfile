# 1. Use the official lightweight Node image
FROM node:24-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package configuration and install production modules
COPY package*.json ./
RUN npm ci --only=production

# 4. Copy the rest of your server source code
COPY . .

# 5. Expose the port your Express app binds to
EXPOSE 5000

# 6. Command to start your engine
CMD [ "node", "server.js" ]