FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y gnupg2

RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y gcc g++ make

WORKDIR /app

COPY lib lib/

COPY package.json .
COPY package-lock.json .

RUN npm ci

CMD npm start
