# Використовуємо офіційний образ Node.js з версією 20 або вище
FROM node:20

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та yarn.lock
COPY package.json yarn.lock ./

# Встановлюємо всі залежності
RUN yarn install

# Копіюємо весь проект у контейнер
COPY . .

# Запускаємо додаток
CMD ["yarn", "start"]
