FROM buildkite/puppeteer:latest

RUN apt-get update -y
RUN apt-get install -y imagemagick
RUN apt-get install -y bc

RUN mkdir -p /var/www/app
RUN mkdir -p /var/www/app/public
RUN mkdir -p /var/files

VOLUME ./files /var/files

WORKDIR /var/www/app

COPY . .

RUN ln -s /var/files ./files
RUN ln -s /var/files/sliced ./public/sliced
COPY ./files/seedData.json ./files/currentData.json

RUN yarn install
# RUN yarn build

