# 1. Build Stage
FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./docs/openapi.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Test Stage
FROM build as test
RUN npm test

# 3. Production Stage
FROM owenrees/node-xskak:latest as production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist/
COPY --from=build /usr/src/app/docs/openapi.json ./docs/
RUN npm ci --omit=dev
CMD ["npm", "run", "start"]
