# Вибираємо образ Node.js
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо код
COPY . .

# Запускаємо сервер
CMD ["npm", "run", "start"]
