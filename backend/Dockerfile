FROM node:20-slim
WORKDIR /app
COPY backend/package.json /app/package.json
RUN npm install --omit=dev
COPY backend /app
COPY dood /app/dood
# SQLite DB will live in /data (mounted as a volume by compose)
ENV SQLITE_PATH=/data/app.db
ENV NODE_ENV=production
EXPOSE 4000
CMD ["npm", "start"]


