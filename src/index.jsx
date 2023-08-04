/*Librairies*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
/*Pages*/
import Home from './pages/home'
import Inventory from './pages/inventory'
import Calendar from './pages/calendar'
import Burger from './pages/burger'
import Login from './pages/login'
import Test from './pages/test'
/*Components*/
import Header from './components/header'
import Footer from './components/footer'
import Error from './components/error'
/*Context*/
import { AuthProvider } from './utils/react/context'
/*CSS*/

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/others" element={<Burger />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
