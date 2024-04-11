import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createuser = async (req, res) => {
    const { firstname, middlename, lastname, username, email, password, department } = req.body;

    // Check if department is one of the allowed values
    const allowedDepartments = ['SSG', 'SSO', 'SSD'];
    if (!allowedDepartments.includes(department)) {
        return res.status(400).json({ message: 'Invalid department. Department must be one of: SSG, SSO, SSD' });
    }

    // Check if any required fields are missing
    if (!firstname || !lastname || !username || !email || !password || !department ||
        firstname === '' || lastname === '' || username === '' || email === '' || password === '' || department === '') {
        return res.status(400).json({ message: 'All fields are required except middlename' });
    }

    // Normalize username and email to lowercase
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // Check if the username or email already exists
    const existingUser = await User.findOne({ 
        $or: [
            { username: normalizedUsername }, 
            { email: normalizedEmail }
        ] 
    });

    if (existingUser) {
        return res.status(400).json({ message: 'Username or email is already in use' });
    }

    //hashed password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = new User({
        firstname, 
        middlename, 
        lastname, 
        username: normalizedUsername, 
        email: normalizedEmail, 
        password: hashedPassword, 
        department
    });
   
    try {
        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};