import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import { authAPI } from "../../services/api";

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = isLogin
                ? await authAPI.login({ email: formData.email, password: formData.password })
                : await authAPI.register(formData);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container card">
                <div className="auth-header">
                    <div className="logo-icon-large">
                        <ArrowRight size={24} color="#6366f1" />
                    </div>
                    <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
                    <p>The smarter way to manage your expenses.</p>
                    {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '10px', borderRadius: '8px', marginTop: '15px', fontSize: '14px' }}>{error}</div>}
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label><User size={16} /> Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                        {loading ? "Please wait..." : (
                            <>
                                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                {isLogin ? "Sign In" : "Create Account"}
                            </>
                        )}
                    </button>

                    {/* Toggle button - prominent, always visible */}
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Don't have an account? Sign Up →" : "Already have an account? Log In →"}
                    </button>
                </form>
            </div>

            <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%);
          padding: 20px;
        }
        .auth-container {
          width: 100%;
          max-width: 440px;
          padding: 36px;
          border-radius: 24px;
        }
        @media (max-width: 480px) {
          .auth-container {
            padding: 28px 22px;
          }
        }
        .auth-header {
           text-align: center;
           margin-bottom: 32px;
        }
        .logo-icon-large {
           width: 48px;
           height: 48px;
           background: #e0e7ff;
           border-radius: 14px;
           display: flex;
           align-items: center;
           justify-content: center;
           margin: 0 auto 20px auto;
        }
        .auth-header h1 {
           margin: 0;
           font-size: 28px;
           color: #0f172a;
        }
        .auth-header p {
           color: #64748b;
           margin-top: 8px;
        }
        .auth-form {
           display: flex;
           flex-direction: column;
           gap: 20px;
        }
        .form-group {
           display: flex;
           flex-direction: column;
           gap: 8px;
        }
        .form-group label {
           font-size: 14px;
           font-weight: 600;
           color: #475569;
           display: flex;
           align-items: center;
           gap: 8px;
        }
        .form-group input {
           padding: 12px 16px;
           border: 1px solid #e2e8f0;
           border-radius: 12px;
           background: #f8fafc;
           transition: all 0.2s;
        }
        .form-group input:focus {
           background: #ffffff;
           border-color: #6366f1;
           outline: none;
           box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .auth-submit {
           margin-top: 10px;
           width: 100%;
           height: 50px;
        }
        .toggle-btn {
          width: 100%;
          padding: 14px;
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #6366f1;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          margin-top: 4px;
        }
        .toggle-btn:hover {
          background: #e0e7ff;
          border-color: #6366f1;
        }
        .auth-divider {
           margin: 24px 0;
           position: relative;
           text-align: center;
        }
        .auth-divider::before {
           content: "";
           position: absolute;
           top: 50%;
           left: 0;
           right: 0;
           height: 1px;
           background: #e2e8f0;
        }
        .auth-divider span {
           background: white;
           padding: 0 12px;
           font-size: 11px;
           font-weight: 700;
           color: #94a3b8;
           position: relative;
        }
        .social-btn {
           width: 100%;
           height: 48px;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 12px;
           background: #0f172a;
           color: white;
           border: none;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.2s;
        }
        .social-btn:hover {
           background: #1e293b;
        }
        .auth-footer {
           text-align: center;
           margin-top: 32px;
           font-size: 14px;
           color: #64748b;
        }
        .auth-footer button {
           background: none;
           border: none;
           color: #6366f1;
           font-weight: 600;
           cursor: pointer;
           padding: 0;
           font-size: inherit;
        }
        .auth-footer button:hover {
           text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default Auth;
