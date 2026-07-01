import dotenv from "dotenv";
import { connectDB, sequelize } from "./src/config/database.js";
import { User } from "./src/models/User.js";

dotenv.config();

const checkUsers = async () => {
  await connectDB();
  const users = await User.findAll({ raw: true });
  console.log("👥 Existing users in database:");
  console.table(users);
  process.exit(0);
};

checkUsers();
