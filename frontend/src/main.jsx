import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0F172A',
          color: '#F1F5F9',
          border: '1px solid rgba(99,102,241,0.3)',
        },
      }}
    />
  </BrowserRouter>
)
