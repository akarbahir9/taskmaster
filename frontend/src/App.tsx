import React, { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check if backend is running
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.data) {
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        setError('');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Cannot connect to server. Make sure the backend is running and MongoDB is available.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUsername('');
    setPassword('');
  };

  if (user) {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>🏪 POS & ERP System</h1>
            <div style={{ 
              background: '#ffffff', 
              color: '#333', 
              padding: '30px', 
              borderRadius: '10px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <h2>✅ Login Successful!</h2>
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p><strong>Welcome:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>🏪 POS & ERP System</h1>
          
          {/* Backend Status */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: backendStatus === 'online' ? '#4CAF50' : 
                             backendStatus === 'offline' ? '#f44336' : '#ff9800',
              color: 'white',
              display: 'inline-block'
            }}>
              Backend Status: {
                backendStatus === 'checking' ? '🔄 Checking...' :
                backendStatus === 'online' ? '✅ Online' :
                '❌ Offline'
              }
            </div>
          </div>

          <div style={{ 
            background: '#ffffff', 
            color: '#333', 
            padding: '30px', 
            borderRadius: '10px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h2>Login</h2>
            
            {backendStatus === 'offline' && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '20px',
                border: '1px solid #ef9a9a'
              }}>
                <h3>⚠️ Cannot Connect to Backend</h3>
                <p>The backend server is not running or MongoDB is not available.</p>
                <p><strong>To fix this:</strong></p>
                <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  <li>Start MongoDB service</li>
                  <li>Run the backend: <code>cd backend && npm run dev</code></li>
                  <li>Seed the database: <code>npm run seed</code></li>
                </ol>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              {error && (
                <div style={{
                  backgroundColor: '#ffcdd2',
                  color: '#d32f2f',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading || backendStatus !== 'online'}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isLoading || backendStatus !== 'online' ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: isLoading || backendStatus !== 'online' ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '14px' }}>
              <h3>Test Credentials:</h3>
              <div style={{ textAlign: 'left' }}>
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Manager:</strong> manager1 / manager123</p>
                <p><strong>Cashier:</strong> cashier1 / cashier123</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
