FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY backend/package*.json ./backend/
RUN npm install
COPY backend ./backend
WORKDIR /app/backend
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/server.js"]