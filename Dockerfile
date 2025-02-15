# base stage
FROM node:22-alpine as base
RUN npm i -g pnpm@9.12.1

# dependencies stage
FROM base AS dependencies
WORKDIR /opt
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# build stage
FROM dependencies AS build
WORKDIR /opt
COPY --from=dependencies /opt/package.json ./package.json
COPY --from=dependencies /opt/node_modules ./node_modules
COPY . .
RUN pnpm build
RUN pnpm prune --prod

# runtime stage
FROM node:22-alpine AS runtime
WORKDIR /opt
COPY --from=build /opt/dist ./dist
COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/package.json ./package.json
CMD [ "node", "dist/main.js" ]
