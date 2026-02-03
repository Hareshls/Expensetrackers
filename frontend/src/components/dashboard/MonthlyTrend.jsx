import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyTrend = ({ expenses }) => {
  // Get last 7 days of spending
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    const dayName = days[date.getDay()];

    const amount = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getDate() === date.getDate() &&
          expDate.getMonth() === date.getMonth() &&
          expDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    return { name: dayName, amount };
  });

  return (
    <div className="card animate-in">
      <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Weekly Spending</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrend;
