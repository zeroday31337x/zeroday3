'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { ChatMessage, AdminStatus, AvailableCommand } from '@/lib/types';

export default function AdminDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [availableCommands, setAvailableCommands] = useState<AvailableCommand[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if already authenticated
    const token = apiClient.getAdminToken();
    if (token) {
      setAdminToken(token);
      setAuthenticated(true);
      loadAdminStatus();
    }
  }, []);

  const loadAdminStatus = async () => {
    try {
      const status = await apiClient.getAdminStatus();
      setAdminStatus(status);
      
      const commands = await apiClient.getAvailableCommands();
      setAvailableCommands(commands.commands);
    } catch (error) {
      console.error('Failed to load admin status:', error);
    }
  };

  const handleAuth = async () => {
    if (!adminToken.trim()) return;
    
    try {
      apiClient.setAdminToken(adminToken);
      await loadAdminStatus();
      setAuthenticated(true);
    } catch (error) {
      alert('Authentication failed. Please check your admin token.');
      apiClient.clearAdminToken();
      setAuthenticated(false);
    }
  };

  const handleLogout = () => {
    apiClient.clearAdminToken();
    setAuthenticated(false);
    setAdminToken('');
    setMessages([]);
    setAdminStatus(null);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await apiClient.executeAdminCommand({
        message: inputMessage,
      });

      // Format the response
      let assistantContent = '';
      
      if (response.success) {
        assistantContent = '✅ **Command executed successfully**\n\n';
        
        if (response.reasoning) {
          assistantContent += `**Reasoning:** ${response.reasoning}\n\n`;
        }
        
        if (response.message) {
          assistantContent += `**Result:** ${response.message}\n\n`;
        }
        
        if (response.output) {
          assistantContent += `**Output:**\n\`\`\`\n${response.output}\n\`\`\`\n\n`;
        }
        
        if (response.data) {
          assistantContent += `**Data:**\n\`\`\`json\n${JSON.stringify(response.data, null, 2)}\n\`\`\``;
        }
      } else {
        assistantContent = `❌ **Command failed**\n\n**Error:** ${response.error || 'Unknown error'}`;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantContent,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ **Error:** ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useExampleCommand = (example: string) => {
    setInputMessage(example);
    setShowCommands(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zd-dark flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-zd-gray border border-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-zd-accent mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 mb-6">Enter your admin token to access the dashboard</p>
          
          <div className="space-y-4">
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="Admin Token"
              className="w-full px-4 py-3 bg-zd-dark border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none"
            />
            
            <button
              onClick={handleAuth}
              className="w-full bg-zd-accent text-zd-dark font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Access Dashboard
            </button>
            
            <div className="text-sm text-gray-500 mt-4">
              <p>Default token: <code className="bg-zd-dark px-2 py-1 rounded">your-secret-key-change-in-production</code></p>
              <p className="mt-2">Set ADMIN_SECRET_KEY environment variable in production.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zd-dark">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zd-accent">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Natural language command interface powered by Gemini AI</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-900/20 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Status Cards */}
        {adminStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zd-gray border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-xl font-bold text-zd-accent mt-1">{adminStatus.status}</div>
            </div>
            <div className="bg-zd-gray border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Gemini AI</div>
              <div className="text-xl font-bold mt-1">
                {adminStatus.gemini_configured ? (
                  <span className="text-green-400">✓ Configured</span>
                ) : (
                  <span className="text-yellow-400">⚠ Not Set</span>
                )}
              </div>
            </div>
            <div className="bg-zd-gray border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Version</div>
              <div className="text-xl font-bold text-zd-text mt-1">{adminStatus.version}</div>
            </div>
            <div className="bg-zd-gray border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Features</div>
              <div className="text-xl font-bold text-zd-text mt-1">{Object.values(adminStatus.features).filter(Boolean).length}/4</div>
            </div>
          </div>
        )}

        {/* Main Chat Interface */}
        <div className="bg-zd-gray border border-gray-800 rounded-lg overflow-hidden">
          {/* Command Helper */}
          <div className="border-b border-gray-800 p-4">
            <button
              onClick={() => setShowCommands(!showCommands)}
              className="text-sm text-zd-accent hover:underline"
            >
              {showCommands ? '▼' : '▶'} Available Commands ({availableCommands.length})
            </button>
            
            {showCommands && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableCommands.map((cmd, idx) => (
                  <div
                    key={idx}
                    onClick={() => useExampleCommand(cmd.example)}
                    className="p-3 bg-zd-dark border border-gray-700 rounded cursor-pointer hover:border-zd-accent transition-all"
                  >
                    <div className="font-semibold text-zd-text text-sm">{cmd.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{cmd.description}</div>
                    <div className="text-xs text-zd-accent mt-2">{cmd.example}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">No messages yet</p>
                <p className="text-sm mt-2">Start by typing a command or click on an example above</p>
              </div>
            )}
            
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-zd-accent text-zd-dark'
                      : 'bg-zd-dark border border-gray-700 text-zd-text'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap font-mono">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-zd-dark/70' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zd-dark border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Processing command...</div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your command... (e.g., 'Show me all products', 'Run the tests')"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-zd-dark border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-3 bg-zd-accent text-zd-dark font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Warning if Gemini not configured */}
        {adminStatus && !adminStatus.gemini_configured && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-400">
            <p className="font-semibold">⚠ Gemini AI Not Configured</p>
            <p className="text-sm mt-1">
              Set the GEMINI_API_KEY environment variable to enable natural language commands.
              Without it, some features may not work properly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
