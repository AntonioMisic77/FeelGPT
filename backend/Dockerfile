# Base Layer: Setup dependencies common to both prod and dev
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

# Prod Layer: Build the app and copy only the necessary files
FROM base AS prod-build

COPY . .

RUN npm run build


# Prod Layer: Copy the built app and install only production dependencies
FROM node:20-slim AS production

WORKDIR /app

COPY --from=prod-build /app/dist /app/dist  
COPY --from=prod-build /app/package*.json /app/

# Copy the .env file if it exists, for production testing
COPY .env /app/.env


RUN npm install --omit=dev --ignore-scripts

EXPOSE 5000

CMD ["node", "dist/index.js"]

# Dev Layer: Copy the app and install all dependencies
FROM base AS dev

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
