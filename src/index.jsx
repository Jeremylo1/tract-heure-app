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
import ProtectedRoute from './components/protectedroute'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/inventory" element={<ProtectedRoute />}>
            <Route index element={<Inventory />} />
          </Route>
          <Route path="/calendar" element={<ProtectedRoute />}>
            <Route index element={<Calendar />} />
          </Route>
          <Route path="/others" element={<ProtectedRoute />}>
            <Route index element={<Burger />} />
          </Route>
          <Route path="/test" element={<ProtectedRoute />}>
            <Route index element={<Test />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
