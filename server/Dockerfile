# Використання базового образу Node.js
FROM node:18

# Встановлення робочої директорії
WORKDIR /app

# Копіюємо package.json і package-lock.json (якщо є)
COPY package*.json ./

# Встановлюємо тільки продакшн-залежності
RUN npm install --production

# Копіюємо весь проєкт у контейнер
COPY . .

# Експонуємо порт (залежить від вашого додатка)
EXPOSE 8081

# Команда для запуску додатка
CMD ["node", "index.js"]
