import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
// Import the Provider you just made!
import { AuthProvider } from "./auth/AuthProvider.jsx";

// 🛒 Import the Apollo Client infrastructure tools
// 📦 Pristine, standard single-line bundle import
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";

// 1. Point our single network wire to the GraphQL gateway endpoint
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/graphql`,
});

// 2. Build an auth interceptor link that automatically tags your JWT token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
// 3. Initialize Apollo Client with a localized in-memory state caching system
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 4. Wrap the ecosystem inside our GraphQL engine provider */}
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
