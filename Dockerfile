FROM node:14-alpine

WORKDIR .
COPY package.json .
RUN yarn install
COPY . .
CMD yarn run start