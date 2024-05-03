# Build stage
FROM node:18.13 as build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
RUN npm install --force -g @angular/cli
COPY . .
RUN ng build --output-path=./dist/main --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/main /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]