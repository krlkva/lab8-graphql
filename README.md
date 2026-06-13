# Лабораторная работа №8: Микросервисная архитектура с GraphQL

Видео-демонстрация работы: https://disk.yandex.ru/i/wnCyxPo99VAD6w 

**Цель работы:** ознакомление с микросервисной архитектурой, реализация взаимодействия между сервисами через GraphQL API Gateway.

Проект представляет собой бэкенд информационной системы, разбитый на три микросервиса:

**Users** - Управление пользователями  4001

**Products** - Управление товарами 4003 

**Orders** - Управление заказами 4002 

**Gateway** - Единая точка входа, объединяет все сервисы 4000


**Frontend → Gateway (GraphQL) → Микросервисы → SQLite**

## Технологии

GraphQL сервер - Apollo Server 

API Gateway - Apollo Gateway 

База данных - SQLite 

Язык - Node.js (JavaScript) 

Запросы - GraphQL Playground / Apollo Client 

## Структура репозитория
graphql-microservices/

├── gateway

│ ├── index.js # API Gateway (порт 4000)

│ └── package.json

├── users/

│ ├── index.js # Микросервис пользователей (порт 4001)

│ ├── users.db # SQLite БД (создаётся автоматически)

│ └── package.json

├── products/

│ ├── index.js # Микросервис товаров (порт 4003)

│ ├── products.db

│ └── package.json

├── orders/

│ ├── index.js # Микросервис заказов (порт 4002)

│ ├── orders.db

│ └── package.json

└── README.md
