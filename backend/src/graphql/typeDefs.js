import { gql } from "graphql-tag";

export const typeDefs = gql`
  # 1. Define what a User looks like
  type User {
    id: ID!
    username: String!
    role: String!
  }

  # 2. Define what a Project looks like (Notice the ENUM field!)
  type Project {
    id: ID!
    name: String!
    status: String!
    userId: Int!
    createdAt: String!
    updatedAt: String!
  }

  # 3. THE READ GATEWAY (Queries)
  type Query {
    # This single query fetches both or either depending on frontend needs!
    me: User
    myProjects: [Project]
  }

  # 4. THE WRITE GATEWAY (Mutations - replacing POST, PUT, DELETE)
  type Mutation {
    createProject(name: String!): Project
    updateProject(id: ID!, name: String, status: String): Project
    deleteProject(id: ID!): String
  }
`;
