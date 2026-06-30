import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Otp = sequelize.define(
  "Otp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codeHash: {
      type: DataTypes.STRING,
      allowNull: false, // Storing hashed OTP codes for elite security
    },
    purpose: {
      type: DataTypes.ENUM("LOGIN", "REGISTER"),
      defaultValue: "LOGIN",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);
