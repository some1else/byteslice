FROM buildkite/puppeteer:latest

RUN apt-get update -y
RUN apt-get install -y imagemagick
RUN apt-get install -y bc

RUN mkdir -p /var/www/app
RUN mkdir -p /var/www/app/public
RUN mkdir -p /var/files

WORKDIR /var/www/app

COPY . .

VOLUME ./files /var/files

RUN ln -s /var/files ./files
RUN ln -s /var/files/sliced ./public/sliced

RUN yarn install
# RUN yarn build

