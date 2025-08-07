import { useState } from 'react'
import './App.css'
import WebsiteTester from './components/WebsiteTester'

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1> Website Security & Performance Tester</h1>
        <p>Comprehensive website analysis tool for security vulnerabilities, performance, and responsiveness</p>
      </div>

      <WebsiteTester />
    </div>
  )
}

export default App
