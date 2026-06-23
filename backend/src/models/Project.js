import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';

export const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // 🔥 ADD THIS FIELD FOR TOGGLE TO ALSO HAVE AN EFFECT OF SOCKETS
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending',
    }
    // Note: We don't manually add 'userId' here. Sequelize will do it for us below!
}, {
    timestamps: true,
});

// Define the Relationship (One-to-Many)
User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId' });