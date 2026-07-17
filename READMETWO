# DevFlow Core Engine Architecture & Setup Guide

Welcome to the DevFlow Core Engine workspace. This repository features a high-performance, full-stack workflow application designed with a detached multi-tier architecture. It supports native HTML5 drag-and-drop operations, dual-lock JWT authentication, Role-Based Access Control (RBAC), persistent relational mapping via MySQL, a real-time event pipeline over WebSockets, and a consolidated GraphQL API gateway running side-by-side with a legacy REST engine.

---

## 📦 Master Dependency Manifest

### 🚀 Backend Server Core Components (`/backend`)

| Package | Purpose / Reason for Installation |
| :--- | :--- |
| `express` | The foundational minimalist web framework used to handle routing, HTTP requests, and middleware processing. |
| `mysql2` | High-performance MySQL client driver allowing Node.js to communicate efficiently with our database instance. |
| `sequelize` | An enterprise-grade Promise-based ORM used to map JS objects directly into MySQL tables, handling schemas and relationships (`1:M`). |
| `dotenv` | Zero-dependency module that loads system configurations and secure credentials from a hidden `.env` file into `process.env`. |
| `cors` | Security middleware enabling cross-origin resource sharing so our Vite development server can securely query our Express ports. |
| `bcrypt` | A cryptographically secure hashing function used to salt and permanently secure user passwords before storing them in the DB. |
| `jsonwebtoken` | Token-based session management system used to mint cryptographically signed keycards (JWTs) for stateful client validation. |
| `socket.io` | Real-time bi-directional event engine used to push database updates (creates, deletes, status toggles) instantaneously to connected clients. |
| `@apollo/server` | The core production-ready GraphQL server execution engine used to parse incoming schema queries and batch multi-resource requests. |
| `graphql` | The foundational specification language engine required behind the scenes by Apollo to compute typed data queries. |

### ⚛️ Frontend UI Applications (`/react-frontend`)

| Package | Purpose / Reason for Installation |
| :--- | :--- |
| `axios` | Promise-based HTTP client used to fetch rest routes, modified to intercept local headers and automatically attach Bearer keys. |
| `lucide-react` | A clean, ultra-lightweight icon pack providing visual interfaces for system checkmarks, editing pencils, and trash buckets. |
| `socket.io-client` | The client-side WebSocket library that hooks into the server pipeline, updating global React states dynamically upon data broadcasts. |
| `@apollo/client` *(Upcoming)* | *To be installed:* The comprehensive state management library used to bind GraphQL schemas directly into reactive UI components. |

---

## 🛠️ New PC Environment Setup Instructions

Follow these exact steps to restore, sync, and ignite the development infrastructure on your new machine.

### 📋 Prerequisites
Ensure your machine has the following clean installations:
1. **Node.js** (v18 or higher recommended)
2. **MySQL Server** and **MySQL Workbench**

---

### 🗄️ Step 1: Database Initialization
1. Open **MySQL Workbench** and connect to your local database engine.
2. Open a new query tab and execute the following SQL command to spin up an empty structural sandbox:
   ```sql
   CREATE DATABASE devflow_db;

 ### Step 2: Establish Backend Environment Keys

1. Navigate into your /backend workspace folder and create a fresh file named .env. Populated it with your local PC credentials: **


PORT=5000
JWT_SECRET=devflow_super_secret_key_change_me_in_production

# Relational Database Mappings
DB_NAME=devflow_db
DB_USER=root
DB_PASS=YOUR_MYSQL_PASSWORD_HERE
DB_HOST=127.0.0.1
DB_DIALECT=mysql

Step 3: Install Dependencies & Launch
Open your system terminal splits and run the following execution blocks:

🖥️ Terminal A: The API & Live WebSocket Engine

cd backend
npm install
node server.js


Expected Console Verification:

🔄 Database tables synced with Sequelize!

🚀 REST Engine running on http://localhost:5000/api

🛒 GraphQL Gateway open on http://localhost:5000/graphql

🎨 Terminal B: The Client Interface Engine


cd react-frontend
npm install
npm run dev

Expected Console Verification:

  ➜  Local:   http://localhost:5173/

🧪 Quick System Verification Log
Once your components initialize, perform this 3-step pipeline smoke test:

Authentication Reset: Open http://localhost:5173/, click register, and sign up as a new user.

Real-Time Workspace Sync: Open an anonymous browser tab alongside your main interface under the exact same login. Add, modify, or check-off a task. Watch the opposite grid layer update with zero layout latency.

The GraphQL Check: Open http://localhost:5000/graphql in your browser. Paste your signed JWT into the client request headers tab as a Bearer property, run the multi-resource batch query, and verify the structured database objects array returns cleanly.

Backend Server Dependencies (/backend)
Run these commands inside your backend/ directory:

Bash
npm install express mysql2 sequelize dotenv cors bcrypt jsonwebtoken socket.io @apollo/server graphql
Detailed Breakdown:
npm install express

Reason: Installs the core web server framework. It handles HTTP request routing, processes incoming payloads, and serves as the foundation upon which all our APIs and middleware sit.

npm install mysql2

Reason: The low-level database driver. It provides the raw network connectivity and protocol wrapper needed for Node.js to talk directly to your local MySQL Server instance.

npm install sequelize

Reason: The Object-Relational Mapper (ORM). It abstracts raw SQL queries so we can interact with our MySQL database using clean JavaScript models and methods (like Project.findAll()), while managing relationships (1:M) between tables automatically.

npm install dotenv

Reason: Environment variable manager. It keeps configuration variables, database passwords, and your secret signing keys hidden away in a .env file instead of hardcoded in your source files.

npm install cors

Reason: Cross-Origin Resource Sharing security patch. By default, browsers block your React frontend (port 5173) from talking to your Express backend (port 5000). This package tells Express it is safe to accept requests from our Vite application.

npm install bcrypt

Reason: Cryptographic password hashing engine. It automatically salts and hashes strings so that passwords are saved securely in your database, preventing cleartext exposure if the database is ever compromised.

npm install jsonwebtoken

Reason: Token-based session authentication. It allows the server to generate a cryptographically signed identity keycard (JWT) upon successful login, which the client passes back on future requests to confirm who they are.

npm install socket.io

Reason: The real-time bi-directional engine. Upgrades our standard HTTP server to support persistent WebSocket pipelines, allowing the backend to instantly push updates out to clients.

npm install @apollo/server

Reason: The core GraphQL server engine. It parses incoming schema scripts, validates data types, handles errors, and routes instructions straight to our database resolvers.

npm install graphql

Reason: The foundational parsing language library required by Apollo. It handles the raw calculations and AST parsing behind the GraphQL specification itself.

⚛️ Frontend UI Dependencies (/react-frontend)
Run these commands inside your react-frontend/ directory:

Bash
npm install axios lucide-react socket.io-client @apollo/client graphql
Detailed Breakdown:
npm install axios

Reason: The Promise-based HTTP networking client. Used to send POST, GET, PUT, and DELETE requests to our legacy REST API endpoints and pass along the Authorization header keys.

npm install lucide-react

Reason: The user interface icon pack. Provides lightweight SVG vector graphic files for the app components, including icons like Circle, CheckCircle2, Edit2, and TrashBucket.

npm install socket.io-client

Reason: The frontend WebSocket antenna. It opens a listener connection back to our backend server on port 5000 to catch any database event broadcasts and update the internal React state variables automatically.

npm install @apollo/client 

Reason: The comprehensive GraphQL client framework. It replaces Axios for our new pipeline, providing custom React hooks (like useQuery and useMutation) that let your UI components pull data directly from the GraphQL gateway.

npm install graphql 
Reason: The frontend query parser language library. Just like on the backend, the frontend @apollo/client needs this installed locally to process the gql query templates you write in your JavaScript files.
