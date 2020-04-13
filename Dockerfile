FROM node:13.11.0-alpine
EXPOSE 3033 9229

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm ci

COPY . /home/app
