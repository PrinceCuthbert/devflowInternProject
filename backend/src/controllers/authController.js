import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
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

    if (!user.password) {
      return res.status(400).json({
        error: "This profile uses social sign-in. Please use Google or GitHub.",
      });
    }

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

// ─── NEW: GITHUB OAUTH CONTROLLER ───
export const githubAuth = async (req, res) => {
  const { code } = req.body; // Incoming short-lived confirmation code from client window redirect

  if (!code) {
    return res
      .status(400)
      .json({ error: "Authorization code parameter missing." });
  }

  try {
    // A. Exchange temporary string token for developer authorization token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({
        error: "Failed to trade validation token with GitHub context.",
      });
    }

    // B. Call standard GitHub Core profile metadata query
    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    // C. Grab real private or public primary emails
    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `token ${accessToken}` },
      },
    );

    const githubId = String(profileResponse.data.id);
    const gitUsername = profileResponse.data.login;
    const verifiedEmail =
      emailResponse.data.find((e) => e.primary)?.email ||
      `${gitUsername}@github.placeholder`;

    // D. Check database via Identity Link or Email matching
    let user = await User.findOne({ where: { githubId } });

    if (!user) {
      // Find if email matches an account created via local email-password setup
      if (verifiedEmail && !verifiedEmail.includes("placeholder")) {
        user = await User.findOne({ where: { email: verifiedEmail } });
      }

      if (user) {
        // Link identity identifier to this user safely
        user.githubId = githubId;
        await user.save();
      } else {
        // Generate an entirely clean account automatically
        let uniqueUsername = gitUsername;
        const collisionCheck = await User.findOne({
          where: { username: uniqueUsername },
        });
        if (collisionCheck) {
          uniqueUsername = `${gitUsername}_gh${Math.floor(1000 + Math.random() * 9000)}`;
        }

        user = await User.create({
          username: uniqueUsername,
          email: verifiedEmail,
          githubId,
          password: null, // Pure GitHub authentication account
          role: "user",
        });
      }
    }

    // E. Issue your application keycard token
    const appToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      token: appToken,
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Identity Engine Crash:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed verification transaction with foreign server instance.",
    });
  }
};



// ─── NEW: GOOGLE OAUTH CONTROLLER ───
export const googleAuth = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Authorization code parameter missing." });
  }

  try {
    // 1. Trade code for Google Tokens
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:5173/oauth/google/callback", 
    });

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res.status(400).json({ error: "Failed to fetch access token from Google context." });
    }

    // 2. Fetch User Profile Data from Google API
    const profileResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const googleId = String(profileResponse.data.id);
    const googleEmail = profileResponse.data.email;
    const givenName = profileResponse.data.given_name || "GoogleUser";

    // 3. Find or Create User Record
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // Look up if user exists via normal email registration
      user = await User.findOne({ where: { email: googleEmail } });

      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        let uniqueUsername = givenName.toLowerCase().replace(/\s+/g, "");
        const collisionCheck = await User.findOne({ where: { username: uniqueUsername } });
        if (collisionCheck) {
          uniqueUsername = `${uniqueUsername}_gg${Math.floor(1000 + Math.random() * 9000)}`;
        }

        user = await User.create({
          username: uniqueUsername,
          email: googleEmail,
          googleId,
          password: null, // No password for pure social signups
          role: "user",
        });
      }
    }

    // 4. Issue standard App JWT
    const appToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token: appToken,
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Google Auth Engine Crash:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed verification transaction with Google token instances.",
    });
  }
};