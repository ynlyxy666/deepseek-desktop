import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import ChatWindow from './components/ChatWindow';
import './styles/App.css';

export default function App() {
  const [visible, setVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.electronAPI.handleToggleChat(() => {
      setVisible(v => !v);
      if (!visible) {
        setTimeout(() => {
          document.querySelector('input')?.focus();
        }, 300);
      }
    });
  }, [visible]);

  const handleSend = async (text) => {
    setMessages(prev => [...prev, {
      type: 'user',
      content: text,
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: text }],
          stream: true
        })
      });

      const reader = response.body.getReader();
      let aiResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(message);
            if (parsed.choices[0].delta.content) {
              aiResponse += parsed.choices[0].delta.content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last.type === 'ai') {
                  return [...prev.slice(0, -1), { ...last, content: aiResponse }];
                }
                return [...prev, { type: 'ai', content: aiResponse }];
              });
            }
          } catch (e) {
            console.error('解析错误:', e);
          }
        }
      }
    } catch (error) {
      console.error('API请求失败:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: '请求失败，请检查API密钥和网络连接'
      }]);
    }
    setIsThinking(false);
  };

  return (
    <div className="app-container">
      <ChatWindow
        visible={visible}
        onSend={handleSend}
        messages={messages}
        isThinking={isThinking}
      />
    </div>
  );
}