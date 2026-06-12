const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Подключение к SQLite (файл БД)
const db = new sqlite3.Database(path.join(__dirname, 'users.db'));

// Создание таблицы пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER
  )
`);

// GraphQL схема
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User
    updateUser(id: ID!, name: String, email: String, age: Int): User
    deleteUser(id: ID!): Boolean
  }
`;

// Резолверы (обработчики запросов)
const resolvers = {
  Query: {
    users: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    user: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  },
  Mutation: {
    createUser: (_, { name, email, age }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
          [name, email, age],
          function(err) {
            if (err) reject(err);
            else {
              db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            }
          });
      });
    },
    updateUser: (_, { id, name, email, age }) => {
      return new Promise((resolve, reject) => {
        const updates = [];
        const values = [];
        if (name !== undefined) { updates.push('name = ?'); values.push(name); }
        if (email !== undefined) { updates.push('email = ?'); values.push(email); }
        if (age !== undefined) { updates.push('age = ?'); values.push(age); }
        values.push(id);
        
        db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values,
          function(err) {
            if (err) reject(err);
            else {
              db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            }
          });
      });
    },
    deleteUser: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        });
      });
    }
  }
};

// Запуск сервера
const start = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
  console.log(`Users service ready at ${url}`);
};

start();
