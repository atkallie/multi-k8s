FROM node:alpine
WORKDIR /var/app/api/
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run", "start"]
