import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import the Provider you just made!
import { AuthProvider } from './auth/AuthProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>  {/* <-- Wrap the App! */}
            <App />
        </AuthProvider>
    </React.StrictMode>,
)