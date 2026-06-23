import { User } from '../models/User.js';

export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, but explicitly exclude the password column!
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error while fetching users." });
    }
};