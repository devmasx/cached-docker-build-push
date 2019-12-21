FROM node:lts-alpine

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci

COPY . .

CMD ["sh"]
# CMD ["node", "/app/bin/cached-docker-build-push.js"]
