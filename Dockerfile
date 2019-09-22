FROM buildkite/puppeteer:latest

RUN apt-get update -y
RUN apt-get install -y imagemagick
RUN apt-get install -y bc

RUN mkdir -p /var/www/app
RUN mkdir -p /var/www/files
VOLUME ./files /var/www/files

WORKDIR /var/www/app

COPY . .

RUN ln -s /var/www/files ./files

RUN yarn install
# RUN yarn build
