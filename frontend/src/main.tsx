import React from 'react'
import ReactDOM from 'react-dom/client'
import mixpanel from 'mixpanel-browser'
import App from './App.tsx'
import './index.css'

mixpanel.init('aa671d370c602491b406b56b75e675fe', {
  autocapture: true,
  record_sessions_percent: 100,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
