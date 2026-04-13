import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Cookie options — use secure + sameSite:none on HTTPS (production)
const cookieOptions = (req) => {
    const isProduction = req.secure || req.headers['x-forwarded-proto'] === 'https';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 10 * 60 * 1000 // 10 minutes
    };
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.cookie('token', token, cookieOptions(req));

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, currency: user.currency, monthlyBudget: user.monthlyBudget, salary: user.salary }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.cookie('token', token, cookieOptions(req));

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, currency: user.currency, monthlyBudget: user.monthlyBudget, salary: user.salary }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions(req));
    res.json({ message: 'Logged out' });
});

// Get Current User
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Profile (Budget & Salary)
router.put('/profile', protect, async (req, res) => {
    try {
        const { monthlyBudget, salary, currency } = req.body;
        const updateData = {};
        if (monthlyBudget !== undefined) updateData.monthlyBudget = (monthlyBudget === "" || monthlyBudget === null) ? 0 : Number(monthlyBudget);
        if (salary !== undefined) updateData.salary = (salary === "" || salary === null) ? 0 : Number(salary);
        if (currency !== undefined) updateData.currency = currency;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                monthlyBudget: user.monthlyBudget,
                salary: user.salary
            }
        });
    } catch (error) {
        console.error('Profile update error full:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

export default router;
