import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// 1. IMPORT THE SEQUELIZE MODEL
import { User } from "../models/User.js";

export const register = async (req, res) => {
  // 💡 FIX: Destructure email and phoneNumber from the incoming request body
  const { username, password, email, phoneNumber } = req.body;

  try {
    // 1. Check MySQL if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save the new user to MySQL!
    await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      // Note: role defaults to 'user' automatically!
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find the user in MySQL
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: "User not found." });

    // 2. Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password." });

    // 3. Create the JWT Keycard using your .env secret
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res
      .status(200)
      .json({ token, id: user.id, username: user.username, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login." });
  }
};
