const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

//const routes = require("./routes");
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization || "",
      }),
    })
  );

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

//app.use(routes);
startApolloServer();
