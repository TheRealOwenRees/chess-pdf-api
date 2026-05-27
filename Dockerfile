# 1. Build Stage
# NODEv24.16.0-alpine3.23
FROM node@sha256:2bdb65ed1dab192432bc31c95f94155ca5ad7fc1392fb7eb7526ab682fa5bf14 AS build
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./jest.config.js ./
COPY ./docs/openapi.json ./
COPY ./preambles ./
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
COPY --from=build /usr/src/app/preambles ./preambles
RUN npm ci --omit=dev

# is the pdflatex command needed on build?
#RUN pdflatex -ini -jobname="./preambles/chess" "&pdflatex" ./preambles/chess.tex

EXPOSE 5000
CMD ["npm", "run", "start"]