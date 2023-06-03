# AmoCRM
Интеграция amoCRM с сайтом API.

## Перед запуском
- На сайте amoCRM, создайте интеграцию, ссылка на перерегистрацию "http://localhost:3000", после заполнения данных предоставят ключи.
- В папке "backend" файл ".development.env" прописать полученные ключи amoCRM.
- Запустить программу MongoDBCompass, url "mongodb://localhost:27017", приложение создаст db под названием "webprojectuserdb", после захода на сайт будет каждый раз обновлять refresh token, чтобы каждый раз не обновлять код авторизации (CODE) в файле ".development.env".

## Команды запуска
- В папке "backend" выполнить команду "yarn start" 
- В папке "frontend" выполнить команду "npm run dev" 
