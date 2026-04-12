import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Don't exit in development, but log the error clearly
    }
};

connectDB();

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});
