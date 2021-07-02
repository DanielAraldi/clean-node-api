# Docker node version
FROM node:14
# local dir from project
WORKDIR /usr/src/clean-node-api
# Copy packege.json and add the project root
COPY package.json .
# Install only production dependencies
RUN npm install --only=prod
