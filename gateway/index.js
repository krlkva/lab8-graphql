const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const USERS_URL = 'http://localhost:4001';
const ORDERS_URL = 'http://localhost:4002';
const PRODUCTS_URL = 'http://localhost:4003';

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
  }

  type Order {
    id: ID!
    userId: Int!
    productId: Int!
    quantity: Int!
    status: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    products: [Product]
    product(id: ID!): Product
    orders: [Order]
    order(id: ID!): Order
    ordersByUser(userId: Int!): [Order]
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User
    updateUser(id: ID!, name: String, email: String, age: Int): User
    deleteUser(id: ID!): Boolean
    createProduct(name: String!, price: Float!, stock: Int!): Product
    updateProduct(id: ID!, name: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): Boolean
    createOrder(userId: Int!, productId: Int!, quantity: Int!): Order
    updateOrderStatus(id: ID!, status: String!): Order
    deleteOrder(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const res = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ users { id name email age } }' })
      });
      const json = await res.json();
      return json.data.users;
    },
    user: async (_, { id }) => {
      const res = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ user(id: ${id}) { id name email age } }` })
      });
      const json = await res.json();
      return json.data.user;
    },
    products: async () => {
      const res = await fetch(PRODUCTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ products { id name price stock } }' })
      });
      const json = await res.json();
      return json.data.products;
    },
    product: async (_, { id }) => {
      const res = await fetch(PRODUCTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ product(id: ${id}) { id name price stock } }` })
      });
      const json = await res.json();
      return json.data.product;
    },
    orders: async () => {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ orders { id userId productId quantity status } }' })
      });
      const json = await res.json();
      return json.data.orders;
    },
    order: async (_, { id }) => {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ order(id: ${id}) { id userId productId quantity status } }` })
      });
      const json = await res.json();
      return json.data.order;
    },
    ordersByUser: async (_, { userId }) => {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ ordersByUser(userId: ${userId}) { id userId productId quantity status } }` })
      });
      const json = await res.json();
      return json.data.ordersByUser;
    }
  },
  Mutation: {
    createUser: async (_, { name, email, age }) => {
      const res = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { createUser(name: "${name}", email: "${email}", age: ${age}) { id name email age } }` })
      });
      const json = await res.json();
      return json.data.createUser;
    },
    updateUser: async (_, args) => {
      const { id, name, email, age } = args;
      let query = `mutation { updateUser(id: ${id}`;
      if (name) query += `, name: "${name}"`;
      if (email) query += `, email: "${email}"`;
      if (age) query += `, age: ${age}`;
      query += `) { id name email age } }`;
      const res = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      return json.data.updateUser;
    },
    deleteUser: async (_, { id }) => {
      const res = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { deleteUser(id: ${id}) }` })
      });
      const json = await res.json();
      return json.data.deleteUser;
    },
    createProduct: async (_, { name, price, stock }) => {
      const res = await fetch(PRODUCTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { createProduct(name: "${name}", price: ${price}, stock: ${stock}) { id name price stock } }` })
      });
      const json = await res.json();
      return json.data.createProduct;
    },
    updateProduct: async (_, args) => {
      const { id, name, price, stock } = args;
      let query = `mutation { updateProduct(id: ${id}`;
      if (name) query += `, name: "${name}"`;
      if (price) query += `, price: ${price}`;
      if (stock) query += `, stock: ${stock}`;
      query += `) { id name price stock } }`;
      const res = await fetch(PRODUCTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      return json.data.updateProduct;
    },
    deleteProduct: async (_, { id }) => {
      const res = await fetch(PRODUCTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { deleteProduct(id: ${id}) }` })
      });
      const json = await res.json();
      return json.data.deleteProduct;
    },
    createOrder: async (_, { userId, productId, quantity }) => {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { createOrder(userId: ${userId}, productId: ${productId}, quantity: ${quantity}) { id userId productId quantity status } }` })
      });
      const json = await res.json();
      return json.data.createOrder;
    },
    updateOrderStatus: async (_, { id, status }) => {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { updateOrderStatus(id: ${id}, status: "${status}") { id userId productId quantity status } }` })
      });
      const json = await res.json();
      return json.data.updateOrderStatus;
    },
    deleteOrder: async (_, { id }) => {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { deleteOrder(id: ${id}) }` })
      });
      const json = await res.json();
      return json.data.deleteOrder;
    }
  }
};

const start = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`Gateway ready at ${url}`);
};

start();
