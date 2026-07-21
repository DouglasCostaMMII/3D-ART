import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={window.location.hostname.endsWith('.github.io') ? '/3D-ART' : '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
