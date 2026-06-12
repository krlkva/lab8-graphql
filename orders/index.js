const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'orders.db'));

db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'pending'
  )
`);

const typeDefs = `#graphql
  type Order {
    id: ID!
    userId: Int!
    productId: Int!
    quantity: Int!
    status: String!
  }

  type Query {
    orders: [Order]
    order(id: ID!): Order
    ordersByUser(userId: Int!): [Order]
  }

  type Mutation {
    createOrder(userId: Int!, productId: Int!, quantity: Int!): Order
    updateOrderStatus(id: ID!, status: String!): Order
    deleteOrder(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    orders: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM orders', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    order: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    ordersByUser: (_, { userId }) => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM orders WHERE userId = ?', [userId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  },
  Mutation: {
    createOrder: (_, { userId, productId, quantity }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO orders (userId, productId, quantity) VALUES (?, ?, ?)',
          [userId, productId, quantity],
          function(err) {
            if (err) reject(err);
            else {
              db.get('SELECT * FROM orders WHERE id = ?', [this.lastID], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            }
          });
      });
    },
    updateOrderStatus: (_, { id, status }) => {
      return new Promise((resolve, reject) => {
        db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id],
          function(err) {
            if (err) reject(err);
            else {
              db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            }
          });
      });
    },
    deleteOrder: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        });
      });
    }
  }
};

const start = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
  console.log(`Orders service ready at ${url}`);
};

start();
