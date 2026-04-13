import { useEffect, useState } from "react";
import { X, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const Toast = ({ toasts, removeToast }) => {
    return (
        <>
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type} toast-enter`}>
                        <div className="toast-icon">
                            {toast.type === "danger" && <AlertTriangle size={20} />}
                            {toast.type === "warning" && <TrendingUp size={20} />}
                            {toast.type === "success" && <CheckCircle size={20} />}
                        </div>
                        <div className="toast-body">
                            <p className="toast-title">{toast.title}</p>
                            <p className="toast-msg">{toast.message}</p>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={16} />
                        </button>
                        <div
                            className="toast-progress"
                            style={{ animationDuration: `${toast.duration || 5000}ms` }}
                        />
                    </div>
                ))}
            </div>

            <style>{`
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 360px;
                    width: calc(100vw - 40px);
                }

                .toast {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px 16px 20px 16px;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px -12px rgba(0,0,0,0.25);
                    position: relative;
                    overflow: hidden;
                    border: 1.5px solid transparent;
                    animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                @keyframes toastSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .toast-danger {
                    background: #fff1f2;
                    border-color: #fca5a5;
                    color: #b91c1c;
                }
                .toast-warning {
                    background: #fffbeb;
                    border-color: #fcd34d;
                    color: #92400e;
                }
                .toast-success {
                    background: #f0fdf4;
                    border-color: #86efac;
                    color: #15803d;
                }

                .toast-icon {
                    flex-shrink: 0;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .toast-danger .toast-icon { background: #fee2e2; }
                .toast-warning .toast-icon { background: #fef3c7; }
                .toast-success .toast-icon { background: #dcfce7; }

                .toast-body { flex: 1; }

                .toast-title {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 700;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .toast-msg {
                    margin: 3px 0 0 0;
                    font-size: 13px;
                    opacity: 0.85;
                    line-height: 1.4;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .toast-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: inherit;
                    opacity: 0.6;
                    padding: 2px;
                    display: flex;
                    flex-shrink: 0;
                    transition: opacity 0.2s;
                }
                .toast-close:hover { opacity: 1; }

                .toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    border-radius: 0 0 0 16px;
                    animation: toastProgress linear forwards;
                    width: 100%;
                }

                .toast-danger .toast-progress { background: #ef4444; }
                .toast-warning .toast-progress { background: #f59e0b; }
                .toast-success .toast-progress { background: #10b981; }

                @keyframes toastProgress {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                @media (max-width: 480px) {
                    .toast-container {
                        top: 12px;
                        right: 12px;
                        left: 12px;
                        width: auto;
                    }
                }
            `}</style>
        </>
    );
};

// Hook to use toasts
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (title, message, type = "success", duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
};

export default Toast;
