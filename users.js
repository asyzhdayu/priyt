# MongoDB — вставьте вашу строку подключения из MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shelter?retryWrites=true&w=majority

# JWT секрет — придумайте длинную случайную строку
JWT_SECRET=your-super-secret-jwt-key-change-this

# Порт сервера (по умолчанию 3001)
PORT=3001

# Разрешённые origins для CORS (ваш фронтенд)
# При локальной разработке:
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
# При деплое на Firebase добавьте ваш домен:
# ALLOWED_ORIGINS=https://your-project.web.app,https://your-domain.ru
