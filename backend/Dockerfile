FROM node:20-slim

WORKDIR /app

# install deps with cache reuse
COPY backend/package*.json ./
RUN npm install --omit=dev

# copy backend sources after dependencies
COPY backend/ .
COPY dood /app/dood

# SQLite DB will live in /data (mounted as a volume by compose)
ENV SQLITE_PATH=/data/app.db
ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]


