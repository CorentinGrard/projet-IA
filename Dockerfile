FROM nginx:stable

# Create app directory
WORKDIR /usr/share/nginx/html

EXPOSE 80

COPY dist/ .