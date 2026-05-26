FROM nginx:alpine
LABEL authors="andreibeliaev"
COPY dist /usr/share/nginx/html