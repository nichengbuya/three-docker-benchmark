
FROM node:16
ENV PROJECT_ENV production
WORKDIR /code
ADD . /code
# COPY build build
# COPY public public
# COPY package.json .
# COPY yarn.lock .

RUN yarn install && yarn build && npm install -g http-server

EXPOSE 3004
CMD http-server ./build -p 3004
