FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# API URL'ini production build sırasında belirtiyoruz ama Nginx proxy yapacağı için relative path yeterli olabilir.
RUN npm run build

# Serve aşaması (Nginx ile)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]