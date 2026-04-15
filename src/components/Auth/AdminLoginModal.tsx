import { useState, useRef, useEffect } from 'react';
import { Shield, X, Eye, EyeOff, LogOut } from 'lucide-react';

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
}

export function AdminLoginModal({ open, onClose, onLogin }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('账号或密码错误');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    } else {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="admin-login-overlay" onClick={onClose} />
      <div className={`admin-login-modal ${shaking ? 'shake' : ''}`}>
        {/* Close button */}
        <button className="admin-login-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="admin-login-icon">
          <Shield size={24} />
        </div>

        {/* Title */}
        <h2 className="admin-login-title">管理员登录</h2>
        <p className="admin-login-subtitle">进入管理员模式以加载私有配置</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label className="admin-input-label">账号</label>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="admin-input"
              placeholder="请输入账号"
              autoComplete="username"
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">密码</label>
            <div className="admin-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="admin-input"
                placeholder="请输入密码"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={!username || !password}
          >
            <Shield size={16} />
            登录
          </button>
        </form>
      </div>
    </>
  );
}

interface AdminBadgeProps {
  username: string | null;
  onLogout: () => void;
}

export function AdminBadge({ username, onLogout }: AdminBadgeProps) {
  return (
    <div className="admin-badge">
      <div className="admin-badge-dot" />
      <span className="admin-badge-text">{username || 'Admin'}</span>
      <button className="admin-badge-logout" onClick={onLogout} title="退出管理员模式">
        <LogOut size={12} />
      </button>
    </div>
  );
}
