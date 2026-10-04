# Onlayn Hamshira landing (Next.js). Built by CI on every push to `production`
# and run as the Swarm service `hamshira_landing`.
#
# NEXT_PUBLIC_* values are inlined at BUILD time: CI writes them to
# .env.production in the build context before this runs (see ci.yml).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# The whole built app, not a pruned copy: `next start` loads next.config.ts
# again at boot, and that file imports from lib/seo/ — the redirect and rewrite
# tables every old Tilda URL depends on. Owned by `node` so the image
# optimizer can write its cache under .next/.
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
