# 1. Build Stage
# NODE v24.13.1-alpine3.22
FROM node@sha256:d28696cabe6a72c5addbb608b344818e5a158d849174abd4b1ae85ab48536280 AS build
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./jest.config.js ./
COPY ./docs/openapi.json ./
RUN npm ci
COPY . .
RUN npm run test
RUN npm run build

# 2. Production Stage
FROM owenrees/node-xskak:latest AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist/
COPY --from=build /usr/src/app/docs/openapi.json ./docs/
RUN npm ci --omit=dev
EXPOSE 5000
CMD ["npm", "run", "start"]