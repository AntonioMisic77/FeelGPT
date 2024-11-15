# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build


FROM nginx:alpine as final
# Copy the entrypoint script
COPY ./nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
# Customaize the Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Copy the build output to the Nginx
COPY --from=build /app/build /usr/share/nginx/html

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]