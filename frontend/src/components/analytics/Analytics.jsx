import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, CreditCard, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { expenseAPI } from "../../services/api";
import "../../styles/analytics.css";

const Analytics = ({ user }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calendarDate, setCalendarDate] = useState(new Date());

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

    // ── Category chart data ──────────────────────────────────
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
    const highestCategory = chartData.length > 0 ? chartData[0] : null;

    // ── Budget ───────────────────────────────────────────────
    const monthlyBudget = user?.monthlyBudget || 0;
    const budgetUsage = monthlyBudget > 0 ? Math.round((totalSpending / monthlyBudget) * 100) : 0;
    const budgetExceeded = monthlyBudget > 0 && totalSpending > monthlyBudget;
    const budgetNear = monthlyBudget > 0 && budgetUsage >= 80 && !budgetExceeded;

    // ── Calendar logic ───────────────────────────────────────
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    // Group spending by day
    const daySpending = monthExpenses.reduce((acc, e) => {
        const day = new Date(e.date).getDate();
        acc[day] = (acc[day] || 0) + e.amount;
        return acc;
    }, {});

    const maxDaySpend = Math.max(...Object.values(daySpending), 1);
    const mostSpentDay = Object.keys(daySpending).reduce((a, b) =>
        daySpending[a] > daySpending[b] ? a : b, null);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

    const monthName = calendarDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const getHeatColor = (day) => {
        const amt = daySpending[day] || 0;
        if (!amt) return 'transparent';
        const ratio = amt / maxDaySpend;
        if (ratio > 0.8) return '#ef4444';
        if (ratio > 0.5) return '#f97316';
        if (ratio > 0.2) return '#f59e0b';
        return '#86efac';
    };

    if (loading) return <div className="content-body" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading analytics...</div>;

    return (
        <div className="content-body">

            {/* ── Monthly Calendar ── TOP ────────────────── */}
            <div className="card calendar-card animate-in" style={{ marginBottom: 24 }}>
                <div className="calendar-header">
                    <h3 style={{ margin: 0 }}>📅 Monthly Spending Calendar</h3>
                    <div className="cal-nav">
                        <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={18} /></button>
                        <span className="cal-month-label">{monthName}</span>
                        <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={18} /></button>
                    </div>
                </div>

                {/* Legend */}
                <div className="cal-legend">
                    <span><span className="legend-dot" style={{ background: '#86efac' }} />Low</span>
                    <span><span className="legend-dot" style={{ background: '#f59e0b' }} />Medium</span>
                    <span><span className="legend-dot" style={{ background: '#f97316' }} />High</span>
                    <span><span className="legend-dot" style={{ background: '#ef4444' }} />Highest</span>
                </div>

                {/* Day labels + grid */}
                <div className="cal-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="cal-day-label">{d}</div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const spent = daySpending[day] || 0;
                        const heatColor = getHeatColor(day);
                        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                        const isMostSpent = String(day) === String(mostSpentDay);
                        return (
                            <div
                                key={day}
                                className={`cal-day ${isToday ? 'cal-today' : ''} ${isMostSpent ? 'cal-most-spent' : ''}`}
                                style={{ background: spent ? heatColor : undefined }}
                                title={spent ? `₹${spent.toLocaleString()} spent` : 'No expenses'}
                            >
                                <span className="cal-day-num">{day}</span>
                                {spent > 0 && (
                                    <span className="cal-day-amt">₹{spent >= 1000 ? `${(spent / 1000).toFixed(1)}k` : spent}</span>
                                )}
                                {isMostSpent && <span className="cal-flame">🔥</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Month total */}
                <div className="cal-footer">
                    <span>Total spent in {calendarDate.toLocaleDateString('en-IN', { month: 'long' })}: </span>
                    <strong>₹{monthExpenses.reduce((a, e) => a + e.amount, 0).toLocaleString()}</strong>
                    <span style={{ marginLeft: 16, color: '#94a3b8' }}>({monthExpenses.length} transactions)</span>
                </div>
            </div>

            {/* ── Budget Alerts ───────────────────────────── */}
            {budgetExceeded && (
                <div className="budget-alert danger animate-in">
                    <AlertTriangle size={20} />
                    <div>
                        <strong>Budget Exceeded! 🚨</strong>
                        <p>You've spent ₹{totalSpending.toLocaleString()} — ₹{(totalSpending - monthlyBudget).toLocaleString()} over your ₹{monthlyBudget.toLocaleString()} budget.</p>
                    </div>
                </div>
            )}

            {budgetNear && (
                <div className="budget-alert warning animate-in">
                    <AlertTriangle size={20} />
                    <div>
                        <strong>Budget Warning ⚠️</strong>
                        <p>You've used {budgetUsage}% of your ₹{monthlyBudget.toLocaleString()} budget. Only ₹{(monthlyBudget - totalSpending).toLocaleString()} left!</p>
                    </div>
                </div>
            )}

            {monthlyBudget > 0 && !budgetExceeded && !budgetNear && budgetUsage > 0 && (
                <div className="budget-alert success animate-in">
                    <CheckCircle size={20} />
                    <div>
                        <strong>On Track ✅</strong>
                        <p>You've used {budgetUsage}% of your budget. ₹{(monthlyBudget - totalSpending).toLocaleString()} remaining.</p>
                    </div>
                </div>
            )}

            <div className="analytics-grid">

                {/* ── Category Bar Chart ──────────────────── */}
                <div className="card main-chart-card animate-in">
                    <h3 style={{ marginBottom: '24px' }}>Category Wise Spending</h3>
                    {chartData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
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
                                        width={90}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                                    />
                                    <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={22}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                            <p>No expenses yet to analyze.</p>
                        </div>
                    )}
                </div>

                {/* ── Quick Insights ──────────────────────── */}
                <div className="insights-column animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="card insight-card">
                        <h3 style={{ marginBottom: '20px' }}>Quick Insights</h3>

                        {highestCategory && (
                            <div className="insight-item">
                                <div className="insight-icon" style={{ backgroundColor: "#fee2e2" }}>
                                    <TrendingUp size={18} color="#ef4444" />
                                </div>
                                <div className="insight-text">
                                    <h4>{highestCategory.name} Heavy</h4>
                                    <p>{highestCategory.name} takes {Math.round((highestCategory.amount / totalSpending) * 100)}% of total spending.</p>
                                </div>
                            </div>
                        )}

                        <div className="insight-item">
                            <div className="insight-icon" style={{ backgroundColor: "#dcfce7" }}>
                                <CreditCard size={18} color="#15803d" />
                            </div>
                            <div className="insight-text">
                                <h4>Transactions</h4>
                                <p>{expenses.length} total transactions recorded.</p>
                            </div>
                        </div>

                        {mostSpentDay && (
                            <div className="insight-item">
                                <div className="insight-icon" style={{ backgroundColor: "#fef3c7" }}>
                                    <Flame size={18} color="#d97706" />
                                </div>
                                <div className="insight-text">
                                    <h4>Highest Spend Day</h4>
                                    <p>Day {mostSpentDay} — ₹{daySpending[mostSpentDay]?.toLocaleString()} spent this month.</p>
                                </div>
                            </div>
                        )}

                        <div className="insight-item">
                            <div className="insight-icon" style={{ backgroundColor: "#e0e7ff" }}>
                                <Target size={18} color="#4338ca" />
                            </div>
                            <div className="insight-text">
                                <h4>Budget Usage</h4>
                                <p>{monthlyBudget > 0 ? `${budgetUsage}% of ₹${monthlyBudget.toLocaleString()} used.` : 'No budget set. Go to Dashboard to set one.'}</p>
                            </div>
                        </div>

                        {/* Budget progress bar */}
                        {monthlyBudget > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <div style={{ background: '#f1f5f9', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(budgetUsage, 100)}%`,
                                        background: budgetExceeded ? '#ef4444' : budgetNear ? '#f97316' : '#10b981',
                                        borderRadius: 8,
                                        transition: 'width 1s ease'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#64748b' }}>
                                    <span>₹0</span>
                                    <span>₹{monthlyBudget.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            <style>{`
                /* Budget Alert */
                .budget-alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 16px 20px;
                    border-radius: 14px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    border: 1.5px solid;
                }
                .budget-alert p { margin: 4px 0 0 0; opacity: 0.85; font-size: 13px; }
                .budget-alert strong { font-size: 14px; }
                .budget-alert.danger {
                    background: #fef2f2;
                    border-color: #fca5a5;
                    color: #991b1b;
                }
                .budget-alert.warning {
                    background: #fffbeb;
                    border-color: #fcd34d;
                    color: #92400e;
                }
                .budget-alert.success {
                    background: #f0fdf4;
                    border-color: #86efac;
                    color: #166534;
                }

                /* Calendar */
                .calendar-card { padding: 24px; }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .cal-nav {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cal-nav-btn {
                    background: #f1f5f9;
                    border: none;
                    border-radius: 8px;
                    padding: 6px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    color: #475569;
                    transition: background 0.2s;
                }
                .cal-nav-btn:hover { background: #e2e8f0; }
                .cal-month-label {
                    font-weight: 700;
                    font-size: 15px;
                    color: #1e293b;
                    min-width: 150px;
                    text-align: center;
                }
                .cal-legend {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 14px;
                    flex-wrap: wrap;
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 500;
                }
                .legend-dot {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-right: 4px;
                }
                .cal-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                }
                .cal-day-label {
                    text-align: center;
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    padding: 6px 0;
                    letter-spacing: 0.5px;
                }
                .cal-day {
                    position: relative;
                    border-radius: 10px;
                    padding: 6px 4px;
                    min-height: 56px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: default;
                    border: 1.5px solid transparent;
                    transition: transform 0.15s;
                }
                .cal-day:hover { transform: scale(1.05); }
                .cal-today {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
                }
                .cal-most-spent {
                    border-color: #ef4444 !important;
                }
                .cal-day-num {
                    font-size: 13px;
                    font-weight: 700;
                    color: #1e293b;
                }
                .cal-day-amt {
                    font-size: 9px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-top: 2px;
                    background: rgba(255,255,255,0.7);
                    border-radius: 4px;
                    padding: 1px 3px;
                }
                .cal-flame {
                    font-size: 11px;
                    position: absolute;
                    top: 2px;
                    right: 3px;
                }
                .cal-footer {
                    margin-top: 16px;
                    padding-top: 14px;
                    border-top: 1px solid #f1f5f9;
                    font-size: 14px;
                    color: #475569;
                }
                .cal-footer strong { color: #6366f1; font-size: 16px; }

                @media (max-width: 480px) {
                    .cal-day { min-height: 44px; padding: 4px 2px; border-radius: 8px; }
                    .cal-day-num { font-size: 11px; }
                    .cal-day-amt { font-size: 8px; }
                    .cal-legend { gap: 10px; }
                    .calendar-card { padding: 16px; }
                    .calendar-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
