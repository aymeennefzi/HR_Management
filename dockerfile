FROM node:20
RUN npm install -g @angular/cli@16
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4200
CMD ["ng","serve","--host", "0.0.0.0", "--disable-host-check"]