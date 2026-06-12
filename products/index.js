const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'products.db'));

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0
  )
`);

const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(name: String!, price: Float!, stock: Int!): Product
    updateProduct(id: ID!, name: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    products: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    product: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  },
  Mutation: {
    createProduct: (_, { name, price, stock }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
          [name, price, stock],
          function(err) {
            if (err) reject(err);
            else {
              db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            }
          });
      });
    },
    updateProduct: (_, { id, name, price, stock }) => {
      return new Promise((resolve, reject) => {
        const updates = [];
        const values = [];
        if (name !== undefined) { updates.push('name = ?'); values.push(name); }
        if (price !== undefined) { updates.push('price = ?'); values.push(price); }
        if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
        values.push(id);
        
        db.run(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values,
          function(err) {
            if (err) reject(err);
            else {
              db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            }
          });
      });
    },
    deleteProduct: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        });
      });
    }
  }
};

const start = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: 4003 } });
  console.log(`Products service ready at ${url}`);
};

start();
