FROM node:18.4.0-alpine3.16  as build

ENV TZ='America/Bogota'

# Create app directory
WORKDIR /app

# Install app dependencies
COPY app/package.json ./
RUN npm config set legacy-peer-deps true
RUN npm install

# Bundle app source
COPY ./app .
RUN npm run build

# production environment
FROM nginx:1.17.9-alpine
COPY --from=build /app/dist/mirage-ng /usr/share/nginx/html
COPY altimeafactory/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
