# inspired by https://mherman.org/blog/dockerizing-an-angular-app/ [20.01.2020]
# specifiy a base image
FROM node:12-alpine

# Set proxy if fails to load image
#ENV no_proxy 'myproxy.com'

# installing packages to make npm able to pull git repositories & more useful packages
RUN apk add --update \
  python \
  python-dev \
  py-pip \
  build-base \
  openssh-client \
&& pip install virtualenv \
&& rm -rf /var/cache/apk/*

# install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# define working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install angular client globally
RUN npm install -g @angular/cli

# to reduce unnecessary rebuilds copy package.json first (npm instal depends only on it)
COPY ./package.json .
# install some dependencies
RUN npm install

# copy source files (including package.json again)
# not necessarly needed here since in docker-compose.prod.yml we set up a reference to outside files
# (to enable auto-refresh when something has changed)
COPY . .

# default startup command
# allow all hosts (otherwise port mapping from outside doesn't work)
# poll is needed to work with hot reload
CMD ng serve --host 0.0.0.0 --poll 1000
