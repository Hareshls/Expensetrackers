import { Trash2 } from "lucide-react";

const ExpenseTable = ({ expenses, onDelete }) => {
  return (
    <div className="table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>DESCRIPTION</th>
            <th>CATEGORY</th>
            <th>PAYMENT</th>
            <th className="text-right">AMOUNT</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id || expense.id}>
              <td>{new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td className="font-semibold">{expense.description}</td>
              <td>
                <span className={`badge ${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
              </td>
              <td>{expense.payment}</td>
              <td className="text-right font-bold text-danger">-₹{expense.amount.toLocaleString()}</td>
              <td className="text-center">
                <button
                  onClick={() => onDelete(expense._id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .table-container {
          overflow-x: auto;
        }
        .expense-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .expense-table th {
          text-align: left;
          padding: 16px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          color: #64748b;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .expense-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }
        .expense-table tr:hover {
          background: #f8fafc;
        }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .text-right { text-align: right; }
        .text-danger { color: #ef4444; }
        
        .badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge.food { background: #e0e7ff; color: #4338ca; }
        .badge.travel { background: #fef3c7; color: #d97706; }
        .badge.shopping { background: #dcfce7; color: #15803d; }
        .badge.rent { background: #fee2e2; color: #991b1b; }
      `}</style>
    </div>
  );
};

export default ExpenseTable;
