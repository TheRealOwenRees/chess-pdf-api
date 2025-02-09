# 1. Build Stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./jest.config.js ./
COPY ./docs/openapi.json ./
RUN npm ci
RUN npm run test
COPY . .
RUN npm run build

# 2. Production Stage
FROM owenrees/node-xskak:latest AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist/
COPY --from=build /usr/src/app/docs/openapi.json ./docs/
RUN npm ci --omit=dev
CMD ["npm", "run", "start"]