import express from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all expenses for a user
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new expense
router.post('/', protect, async (req, res) => {
    try {
        console.log('Adding expense:', req.body);
        const { description, amount, category, date, payment } = req.body;
        const expense = new Expense({
            userId: req.user.id,
            description,
            amount,
            category,
            date,
            payment
        });
        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an expense
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
