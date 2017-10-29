# Base Docker image used in the CI pipeline

FROM ubuntu:16.04
MAINTAINER Bernhard Wittmann <b.wittmann@mail.de>

RUN apt-get update -y -qq
RUN apt-get install -y -qq build-essential libffi-dev libpq-dev libfontconfig1
RUN apt-get install -y -qq python3 python3-dev python3-pip
RUN apt-get install -y -qq libpq-dev
RUN apt-get install -y -qq nodejs npm

WORKDIR /app

# pip
COPY requirements.txt /app
RUN pip3 install --upgrade pip
RUN pip3 install virtualenv
RUN virtualenv --no-site-packages venv
RUN . venv/bin/activate && pip3 install -r /app/requirements.txt

# npm
RUN ln -s `which nodejs` /usr/bin/node
COPY web/vueapp/package.json /app
RUN npm install

