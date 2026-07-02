import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Prevents two people from registering the same username
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // CHANGED: Nullable because OAuth users do not have a local password
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // CHANGED: Nullable in case a provider lacks a public email address
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true, // CHANGED: Nullable since social sign-ins do not yield phone numbers
    },
    githubId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // NEW: Links a unique profile back to GitHub securely
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // NEW: Links a unique profile back to Google securely
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);
