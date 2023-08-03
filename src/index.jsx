/*Librairies*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
/*Pages*/
import Home from './pages/home'
import Inventory from './pages/inventory'
import Calendar from './pages/calendar'
import Burger from './pages/burger'
import Connection from './pages/connection'
import Test from './pages/test'
/*Components*/
import Header from './components/header'
import Footer from './components/footer'
import Error from './components/error'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/others" element={<Burger />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>,
)
