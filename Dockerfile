FROM buildkite/puppeteer:v1.12.0


RUN apt-get update -y
# RUN apt-get install -y imagemagick
RUN apt-get install -y imagemagick-6.q16

RUN apt-get install -y bc


# RUN mkdir -p /var/www/tools
# RUN wget https://github.com/ericchiang/pup/releases/download/v0.4.0/pup_v0.4.0_linux_amd64.zip > /var/www/tools/pup.zip
# RUN unzip /var/www/tools/pup.zip -d /var/www/tools/pup

RUN mkdir -p /var/www/app
RUN mkdir -p /var/www/files
VOLUME ./files /var/www/files

WORKDIR /var/www/app

COPY . .

RUN ln -s /var/www/files ./files

RUN yarn install
# RUN yarn build
