FROM ubuntu:18.04
RUN apt-get update \
 && apt-get install -y curl \
 && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
 && apt-get install -y nodejs

WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD [ "node", "dist/app.js" ]
