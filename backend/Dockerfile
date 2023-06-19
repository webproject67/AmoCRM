FROM node:lts-alpine
WORKDIR /backend
COPY package.json yarn.lock ./ 
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]