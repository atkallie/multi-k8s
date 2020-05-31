FROM node:alpine
WORKDIR /var/app/worker/
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run", "start"]
