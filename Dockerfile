FROM node:20.12.1-alpine as base
# app dependency
RUN npm i -g pnpm
# for pg_dump command
# RUN apk add --no-cache postgresql-client 
# for migration run
# RUN npm i -g typeorm
# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

FROM base as builder
WORKDIR /usr/src/app
COPY --chown=appuser:appgroup package*.json ./
RUN pnpm install
COPY --chown=appuser:appgroup . .
RUN pnpm run build


FROM base as production
WORKDIR /app
COPY --chown=appuser:appgroup package*.json ./
RUN pnpm install --prod
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist
# Change ownership of application files
RUN chown -R appuser:appgroup /app
# Switch to the non-root user
USER appuser
# CMD npx typeorm migration:run --dataSource=dist/src/database/data-source.js && node dist/src/main.js
CMD ["node", "dist/src/main.js"]