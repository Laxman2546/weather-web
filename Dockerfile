FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY  . .

ARG VITE_WEATHER_KEY

ENV VITE_WEATHER_KEY=${VITE_WEATHER_KEY}

RUN npm run build


FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]
