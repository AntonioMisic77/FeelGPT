# Base Layer: Setup dependencies common to both prod and dev
FROM node:20-alpine as base

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache openssl

RUN npm install

# Prod Layer: Build the app and copy only the necessary files
FROM base AS prod-build

COPY . .

# generate Prisma Client
RUN npx prisma generate

RUN npm run build

# Prod Layer: Copy the built app and install only production dependencies
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=prod-build /app/dist /app/dist  
COPY --from=prod-build /app/package*.json /app/
COPY --from=prod-build /app/prisma /app/prisma
COPY --from=prod-build  /app/node_modules/.prisma/client ./node_modules/.prisma/client


# Copy the .env file if it exists, for production testing
COPY .env /app/.env

RUN npm install --omit=dev --ignore-scripts
RUN npm uninstall bcrypt
RUN npm install bcrypt

EXPOSE 5000

CMD ["node", "dist/src/index.js"]

# Dev Layer: Copy the app and install all dependencies
FROM base AS dev

WORKDIR /app

COPY prisma ./prisma

# generate Prisma Client
RUN npx prisma generate

COPY . .

EXPOSE 5000

# CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "dev"]
CMD ["sh", "-c", "npm run test && npm run dev"]
