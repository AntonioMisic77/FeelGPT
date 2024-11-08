# Base Layer: Setup dependencies common to both prod and dev
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma prisma

RUN npx prisma generate

# Prod Layer: Build the app and copy only the necessary files
FROM base AS prod-build

COPY . .

RUN npm run build


# Prod Layer: Copy the built app and install only production dependencies
FROM node:20-slim AS production

WORKDIR /app

COPY --from=prod-build /app/dist /app/dist
COPY --from=prod-build /app/package*.json /app/
COPY --from=prod-build /app/prisma /app/prisma

RUN npm install --only=production --ignore-scripts

EXPOSE 5000

CMD ["node", "dist/src/index.js"]

# Dev Layer: Copy the app and install all dependencies
FROM base AS dev

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
