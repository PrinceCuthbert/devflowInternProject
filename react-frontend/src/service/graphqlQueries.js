import { gql } from "@apollo/client";

// 🛒 1. READ: The consolidated query you successfully tested in Postman!
export const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      name
      status
      userId
    }
  }
`;

// 🏗️ 2. WRITE: Mutation to add a new project row
export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!) {
    createProject(name: $name) {
      id
      name
      status
      userId
    }
  }
`;

// 🔄 3. WRITE: Mutation to edit or toggle project attributes
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $status: String) {
    updateProject(id: $id, name: $name, status: $status) {
      id
      name
      status
      userId
    }
  }
`;

// 🗑️ 4. WRITE: Mutation to destroy a task row by ID
export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
