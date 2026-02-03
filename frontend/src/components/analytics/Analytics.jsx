import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { expenseAPI } from "../../services/api";
import "../../styles/analytics.css";

const Analytics = ({ user }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await expenseAPI.getAll();
                setExpenses(response.data);
            } catch (error) {
                console.error("Error fetching analytics data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    // Process data for category chart
    const categoryTotals = expenses.reduce((acc, curr) => {
        const category = curr.category || "Others";
        acc[category] = (acc[category] || 0) + curr.amount;
        return acc;
    }, {});

    const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#f87171"];

    const chartData = Object.keys(categoryTotals).map((name, index) => ({
        name,
        amount: categoryTotals[name],
        color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.amount - a.amount);

    const totalSpending = chartData.reduce((acc, cat) => acc + cat.amount, 0);

    // Find highest spending category
    const highestCategory = chartData.length > 0 ? chartData[0] : null;

    // Budget insight
    const monthlyBudget = user?.monthlyBudget || 50000;
    const budgetUsage = totalSpending > 0 ? Math.round((totalSpending / monthlyBudget) * 100) : 0;

    if (loading) return <div className="content-body">Loading analytics...</div>;

    return (
        <div className="content-body">
            <div className="analytics-grid">
                <div className="card main-chart-card animate-in">
                    <h3 style={{ marginBottom: '24px' }}>Category Wise Spending</h3>
                    {chartData.length > 0 ? (
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#1e293b', fontSize: 13, fontWeight: 500 }}
                                        width={100}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                                    />
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>No expense data available for analysis.</div>
                    )}
                </div>

                <div className="insights-column animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="card insight-card">
                        <h3 style={{ marginBottom: '20px' }}>Quick Insights</h3>

                        {highestCategory && (
                            <div className="insight-item">
                                <div className="insight-icon" style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}>
                                    <TrendingUp size={20} />
                                </div>
                                <div className="insight-text">
                                    <h4>{highestCategory.name} Heavy</h4>
                                    <p>{highestCategory.name} consumes {Math.round((highestCategory.amount / totalSpending) * 100)}% of your total spending.</p>
                                </div>
                            </div>
                        )}

                        <div className="insight-item">
                            <div className="insight-icon" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                                <CreditCard size={20} />
                            </div>
                            <div className="insight-text">
                                <h4>Transaction Count</h4>
                                <p>You have made {expenses.length} transactions in total.</p>
                            </div>
                        </div>

                        <div className="insight-item">
                            <div className="insight-icon" style={{ backgroundColor: "#e0e7ff", color: "#4338ca" }}>
                                <Target size={20} />
                            </div>
                            <div className="insight-text">
                                <h4>Budget Usage</h4>
                                <p>{budgetUsage}% of monthly target (₹{monthlyBudget.toLocaleString()}) used.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
